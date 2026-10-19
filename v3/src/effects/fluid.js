/**
 * v3/src/effects/fluid.js - WebGL Fluid Dynamics Simulation Engine (v3)
 * =====================================================================
 * Role: High-performance GPU-accelerated Navier-Stokes fluid physics pipeline.
 *       Computes advection, vorticity confinement, divergence, and pressure Poisson equations
 *       in custom GLSL shaders to render interactive fluid dye trails behind the user's cursor.
 */

const SMOKE_CONFIG = {
  SIM_RESOLUTION: window.innerWidth < 768 ? 64 : 128,
  DYE_RESOLUTION: window.innerWidth < 768 ? 512 : 1024,
  DENSITY_DISSIPATION: 0.92,
  VELOCITY_DISSIPATION: 0.45,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: window.innerWidth < 768 ? 16 : 22,
  CURL: 14,
  SPLAT_RADIUS: 0.38,
  SPLAT_FORCE: 6000,
  SHADING: true,
  OPACITY: 0.75,
  SOFTNESS: 3.2,
  COLOR_SPEED: 0.45,
  INTENSITY: 0.32,
  IDLE_STOP_MS: 8000
};

// Pastel Technical Palette: Emerald Mint, Soft Violet, Cyan, Coral, Indigo
const SMOKE_PALETTE = [
  [0.06, 0.85, 0.45], // Mint
  [0.55, 0.25, 0.98], // Electric Violet
  [0.15, 0.55, 1.00], // Technical Slate Blue
  [0.95, 0.30, 0.45], // Soft Coral
  [0.08, 0.78, 0.75]  // Cyan Telemetry
];

function getWebGLContext(canvas) {
  const params = {
    alpha: true,
    premultipliedAlpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false
  };

  let gl = canvas.getContext('webgl2', params);
  const isWebGL2 = Boolean(gl);
  if (!isWebGL2) {
    gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
  }
  if (!gl) return null;

  let halfFloat, supportLinearFiltering;
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
  }
  gl.clearColor(0, 0, 0, 0);

  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;
  if (!halfFloatTexType) return null;

  function supportRenderTextureFormat(internalFormat, format, type) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  }

  function getSupportedFormat(internalFormat, format, type) {
    if (!supportRenderTextureFormat(internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F: return getSupportedFormat(gl.RG16F, gl.RG, type);
        case gl.RG16F: return getSupportedFormat(gl.RGBA16F, gl.RGBA, type);
        default: return null;
      }
    }
    return { internalFormat, format };
  }

  let formatRGBA, formatRG, formatR;
  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl.RG16F, gl.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl.R16F, gl.RED, halfFloatTexType);
  } else {
    formatRGBA = formatRG = formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
  }
  if (!formatRGBA || !formatRG || !formatR) return null;

  return {
    gl,
    ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering }
  };
}

export class FluidSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.isRunning = false;
    this.rafId = null;
    this.lastTick = 0;
    this.lastMoveTime = 0;
    this.leavingSince = 0;

    const ctx = getWebGLContext(canvas);
    if (!ctx) {
      console.warn('WebGL float textures not supported on this device.');
      this.supported = false;
      return;
    }

    this.supported = true;
    this.gl = ctx.gl;
    this.ext = ctx.ext;
    this.initPipeline();
  }

  initPipeline() {
    const gl = this.gl;
    const ext = this.ext;
    const config = SMOKE_CONFIG;
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 512;
      config.SHADING = false;
    }

    const compileShader = (type, source, keywords) => {
      if (keywords) source = keywords.map(k => `#define ${k}\n`).join('') + source;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const makeProgram = (vs, fs) => {
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(program, i).name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return { program, uniforms, bind() { gl.useProgram(program); } };
    };

    const baseVertex = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const clearShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
      #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
      #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
        velocity = clamp(velocity, -1000.0, 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying highp vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    const displayShader = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform vec2 blurStep;
      uniform float uOpacity;

      vec3 soft (vec2 uv) {
        vec3 c = texture2D(uTexture, uv).rgb * 0.25;
        c += texture2D(uTexture, uv + vec2( blurStep.x, 0.0)).rgb * 0.125;
        c += texture2D(uTexture, uv + vec2(-blurStep.x, 0.0)).rgb * 0.125;
        c += texture2D(uTexture, uv + vec2(0.0,  blurStep.y)).rgb * 0.125;
        c += texture2D(uTexture, uv + vec2(0.0, -blurStep.y)).rgb * 0.125;
        c += texture2D(uTexture, uv + blurStep).rgb * 0.0625;
        c += texture2D(uTexture, uv - blurStep).rgb * 0.0625;
        c += texture2D(uTexture, uv + vec2(blurStep.x, -blurStep.y)).rgb * 0.0625;
        c += texture2D(uTexture, uv + vec2(-blurStep.x, blurStep.y)).rgb * 0.0625;
        return c;
      }

      void main () {
        vec3 c = soft(vUv);
      #ifdef SHADING
        vec2 g = blurStep * 1.5;
        float dx = length(texture2D(uTexture, vUv + vec2(g.x, 0.0)).rgb) - length(texture2D(uTexture, vUv - vec2(g.x, 0.0)).rgb);
        float dy = length(texture2D(uTexture, vUv + vec2(0.0, g.y)).rgb) - length(texture2D(uTexture, vUv - vec2(0.0, g.y)).rgb);
        vec3 n = normalize(vec3(dx, dy, length(blurStep)));
        float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.85, 0.85, 1.0);
        c *= diffuse;
      #endif
        c = clamp(c, 0.0, 1.0);
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a) * uOpacity;
      }
    `, config.SHADING ? ['SHADING'] : null);

    this.programs = {
      clear: makeProgram(baseVertex, clearShader),
      splat: makeProgram(baseVertex, splatShader),
      advection: makeProgram(baseVertex, advectionShader),
      divergence: makeProgram(baseVertex, divergenceShader),
      curl: makeProgram(baseVertex, curlShader),
      vorticity: makeProgram(baseVertex, vorticityShader),
      pressure: makeProgram(baseVertex, pressureShader),
      gradientSubtract: makeProgram(baseVertex, gradientSubtractShader),
      display: makeProgram(baseVertex, displayShader)
    };

    // Full screen quad
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    this.initFramebuffers();
    this.pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, started: false };
    this.colorT = Math.random() * SMOKE_PALETTE.length;
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(this.canvas.clientWidth * dpr);
    const h = Math.floor(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      return true;
    }
    return false;
  }

  createFBO(w, h, internalFormat, format, type, param) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return {
      texture, fbo, width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
      attach: (id) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; }
    };
  }

  createDoubleFBO(w, h, internalFormat, format, type, param) {
    let a = this.createFBO(w, h, internalFormat, format, type, param);
    let b = this.createFBO(w, h, internalFormat, format, type, param);
    return {
      width: w, height: h, texelSizeX: a.texelSizeX, texelSizeY: a.texelSizeY,
      get read() { return a; }, get write() { return b; },
      swap() { const t = a; a = b; b = t; }
    };
  }

  getResolution(resolution) {
    const gl = this.gl;
    let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspect < 1) aspect = 1 / aspect;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspect);
    if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
    return { width: min, height: max };
  }

  initFramebuffers() {
    const gl = this.gl;
    const ext = this.ext;
    this.resizeCanvas();

    const simRes = this.getResolution(SMOKE_CONFIG.SIM_RESOLUTION);
    const dyeRes = this.getResolution(SMOKE_CONFIG.DYE_RESOLUTION);
    const type = ext.halfFloatTexType;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);
    this.dye = this.createDoubleFBO(dyeRes.width, dyeRes.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, type, filtering);
    this.velocity = this.createDoubleFBO(simRes.width, simRes.height, ext.formatRG.internalFormat, ext.formatRG.format, type, filtering);
    this.divergence = this.createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, type, gl.NEAREST);
    this.curl = this.createFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, type, gl.NEAREST);
    this.pressure = this.createDoubleFBO(simRes.width, simRes.height, ext.formatR.internalFormat, ext.formatR.format, type, gl.NEAREST);
  }

  blit(target) {
    const gl = this.gl;
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  step(dt, densityDissipation) {
    const gl = this.gl;
    const p = this.programs;
    const v = this.velocity;
    const d = this.dye;

    gl.disable(gl.BLEND);

    // 1. Curl
    p.curl.bind();
    gl.uniform2f(p.curl.uniforms.texelSize, v.texelSizeX, v.texelSizeY);
    gl.uniform1i(p.curl.uniforms.uVelocity, v.read.attach(0));
    this.blit(this.curl);

    // 2. Vorticity
    p.vorticity.bind();
    gl.uniform2f(p.vorticity.uniforms.texelSize, v.texelSizeX, v.texelSizeY);
    gl.uniform1i(p.vorticity.uniforms.uVelocity, v.read.attach(0));
    gl.uniform1i(p.vorticity.uniforms.uCurl, this.curl.attach(1));
    gl.uniform1f(p.vorticity.uniforms.curl, SMOKE_CONFIG.CURL);
    gl.uniform1f(p.vorticity.uniforms.dt, dt);
    this.blit(v.write); v.swap();

    // 3. Divergence
    p.divergence.bind();
    gl.uniform2f(p.divergence.uniforms.texelSize, v.texelSizeX, v.texelSizeY);
    gl.uniform1i(p.divergence.uniforms.uVelocity, v.read.attach(0));
    this.blit(this.divergence);

    // 4. Pressure clear
    p.clear.bind();
    gl.uniform1i(p.clear.uniforms.uTexture, this.pressure.read.attach(0));
    gl.uniform1f(p.clear.uniforms.value, SMOKE_CONFIG.PRESSURE);
    this.blit(this.pressure.write); this.pressure.swap();

    // 5. Pressure Poisson iterations
    p.pressure.bind();
    gl.uniform2f(p.pressure.uniforms.texelSize, v.texelSizeX, v.texelSizeY);
    gl.uniform1i(p.pressure.uniforms.uDivergence, this.divergence.attach(0));
    for (let i = 0; i < SMOKE_CONFIG.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(p.pressure.uniforms.uPressure, this.pressure.read.attach(1));
      this.blit(this.pressure.write); this.pressure.swap();
    }

    // 6. Subtract gradient
    p.gradientSubtract.bind();
    gl.uniform2f(p.gradientSubtract.uniforms.texelSize, v.texelSizeX, v.texelSizeY);
    gl.uniform1i(p.gradientSubtract.uniforms.uPressure, this.pressure.read.attach(0));
    gl.uniform1i(p.gradientSubtract.uniforms.uVelocity, v.read.attach(1));
    this.blit(v.write); v.swap();

    // 7. Advect velocity
    p.advection.bind();
    gl.uniform2f(p.advection.uniforms.texelSize, v.texelSizeX, v.texelSizeY);
    if (!this.ext.supportLinearFiltering) {
      gl.uniform2f(p.advection.uniforms.dyeTexelSize, v.texelSizeX, v.texelSizeY);
    }
    const velId = v.read.attach(0);
    gl.uniform1i(p.advection.uniforms.uVelocity, velId);
    gl.uniform1i(p.advection.uniforms.uSource, velId);
    gl.uniform1f(p.advection.uniforms.dt, dt);
    gl.uniform1f(p.advection.uniforms.dissipation, SMOKE_CONFIG.VELOCITY_DISSIPATION);
    this.blit(v.write); v.swap();

    // 8. Advect dye
    p.advection.bind();
    if (!this.ext.supportLinearFiltering) {
      gl.uniform2f(p.advection.uniforms.dyeTexelSize, d.texelSizeX, d.texelSizeY);
    }
    gl.uniform1i(p.advection.uniforms.uVelocity, v.read.attach(0));
    gl.uniform1i(p.advection.uniforms.uSource, d.read.attach(1));
    gl.uniform1f(p.advection.uniforms.dissipation, densityDissipation);
    this.blit(d.write); d.swap();
  }

  render() {
    const p = this.programs.display;
    const gl = this.gl;
    p.bind();
    gl.uniform2f(p.uniforms.blurStep, SMOKE_CONFIG.SOFTNESS / gl.drawingBufferWidth, SMOKE_CONFIG.SOFTNESS / gl.drawingBufferHeight);
    gl.uniform1f(p.uniforms.uOpacity, SMOKE_CONFIG.OPACITY);
    gl.uniform1i(p.uniforms.uTexture, this.dye.read.attach(0));
    this.blit(null);
  }

  splat(x, y, dx, dy, color) {
    const gl = this.gl;
    const sp = this.programs.splat;
    const aspect = this.canvas.width / this.canvas.height;
    const radius = aspect > 1 ? (SMOKE_CONFIG.SPLAT_RADIUS / 100) * aspect : SMOKE_CONFIG.SPLAT_RADIUS / 100;

    // Splat velocity
    sp.bind();
    gl.uniform1i(sp.uniforms.uTarget, this.velocity.read.attach(0));
    gl.uniform1f(sp.uniforms.aspectRatio, aspect);
    gl.uniform2f(sp.uniforms.point, x, y);
    gl.uniform3f(sp.uniforms.color, dx, dy, 0);
    gl.uniform1f(sp.uniforms.radius, radius);
    this.blit(this.velocity.write); this.velocity.swap();

    // Splat dye
    gl.uniform1i(sp.uniforms.uTarget, this.dye.read.attach(0));
    gl.uniform3f(sp.uniforms.color, color[0], color[1], color[2]);
    this.blit(this.dye.write); this.dye.swap();
  }

  currentColor(dt) {
    this.colorT = (this.colorT + dt * SMOKE_CONFIG.COLOR_SPEED) % SMOKE_PALETTE.length;
    const i = Math.floor(this.colorT);
    const f = this.colorT - i;
    const a = SMOKE_PALETTE[i];
    const b = SMOKE_PALETTE[(i + 1) % SMOKE_PALETTE.length];
    const s = f * f * (3 - 2 * f);
    return [0, 1, 2].map(k => (a[k] + (b[k] - a[k]) * s) * SMOKE_CONFIG.INTENSITY);
  }

  updatePointer(clientX, clientY) {
    if (!this.supported) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = 1 - (clientY - rect.top) / rect.height;

    if (!this.pointer.started) {
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointer.started = true;
      return;
    }

    const aspect = this.canvas.width / this.canvas.height;
    let dx = x - this.pointer.x;
    let dy = y - this.pointer.y;
    if (aspect < 1) dx *= aspect;
    if (aspect > 1) dy /= aspect;

    this.pointer.dx += dx;
    this.pointer.dy += dy;
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.moved = this.pointer.dx !== 0 || this.pointer.dy !== 0;

    this.lastMoveTime = performance.now();
    this.leavingSince = 0;
    this.start();
  }

  resetPointer() {
    this.pointer.started = false;
    this.pointer.dx = 0;
    this.pointer.dy = 0;
    this.pointer.moved = false;
  }

  triggerPulse(normX = 0.5, normY = 0.5) {
    if (!this.supported) return;
    const burstColors = [
      [0.08, 0.85, 0.50], // Mint
      [0.60, 0.28, 1.00], // Violet
      [0.15, 0.60, 1.00]  // Cyan/Blue
    ];

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const speed = 3600;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      const offset = 0.04;
      const col = burstColors[i % burstColors.length];
      this.splat(
        normX + Math.cos(angle) * offset,
        normY + Math.sin(angle) * offset,
        dx,
        dy,
        col
      );
    }
    this.lastMoveTime = performance.now();
    this.start();
  }

  frame(dt, now) {
    if (this.resizeCanvas()) {
      this.initFramebuffers();
    }

    const color = this.currentColor(dt);
    if (this.pointer.moved && !this.leavingSince) {
      this.splat(
        this.pointer.x,
        this.pointer.y,
        this.pointer.dx * SMOKE_CONFIG.SPLAT_FORCE,
        this.pointer.dy * SMOKE_CONFIG.SPLAT_FORCE,
        color
      );
    }
    this.pointer.dx = 0;
    this.pointer.dy = 0;
    this.pointer.moved = false;

    const leavingBoost = this.leavingSince ? 1 + Math.min(6, (now - this.leavingSince) / 140) : 1;
    this.step(dt, SMOKE_CONFIG.DENSITY_DISSIPATION * leavingBoost);
    this.render();
  }

  start() {
    if (!this.supported) return;
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTick = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;
      const dt = this.lastTick ? Math.min((now - this.lastTick) / 1000, 1 / 60) : 1 / 60;
      this.lastTick = now;

      this.frame(dt, now);

      const idleFor = now - this.lastMoveTime;
      if (idleFor > SMOKE_CONFIG.IDLE_STOP_MS) {
        this.stop();
        return;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTick = 0;
  }
}
