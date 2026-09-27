# EMT---Sims
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/EMT---Sims
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# ⚡ Electromagnetic Theory (EMT) 3D Physics Simulations & Learning Suite

Welcome to the **23ECE204 Electromagnetic Theory and Waves** interactive 3D WebGL simulation repository and comprehensive study suite!

This repository contains **interactive 3D physics engines**, **custom sandbox laboratories**, **intuitive vector calculus visualizers**, and **consolidated lecture notes** designed to help engineering students intuitively understand how electric charges, electric fields, magnetic fields, vector calculus operators ($\nabla$), boundary conditions, and Maxwell's equations work.

---

## 🚀 Quick Start - Open in Google Chrome

**No local web server or installation required to view the simulations!**

1. Simply double-click or right-click any `.html` file in your file explorer.
2. Select **"Open with Google Chrome"** (or Firefox / Edge / Safari).
3. Interact with the 3D physics scenes using your mouse:
   - **Rotate Camera**: Left-click + drag
   - **Pan Camera**: Right-click + drag
   - **Zoom In/Out**: Scroll wheel

---

## 🎯 Featured Interactive Experiment Laboratories

### 1. 🧠 [Vector Calculus Intuition Lab (`Vector_Calculus_Intuition.html`)](file:///dev/shm/EMT%20-%20Sims/Vector_Calculus_Intuition.html)
- **Concept**: True physical intuition for **Gradient ($\nabla V$)**, **Divergence ($\nabla \cdot \vec{F}$)**, and **Curl ($\nabla \times \vec{F}$)**.
- **Why It Matters**:
  - **Gradient**: Steepness of potential hills. Why $\vec{E} = -\nabla V$.
  - **Divergence**: Faucets (charge sources) and drains (sinks). Why $\nabla \cdot \vec{D} = \rho_v$ and $\nabla \cdot \vec{B} = 0$.
  - **Curl**: Swirling whirlpools & rotation. Why currents create curling magnetic fields $\nabla \times \vec{H} = \vec{J}$ and time-varying $\vec{B}$ fields induce curling $\vec{E}$ fields $\nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t}$.

### 2. ⚡ [Electrostatics Sandbox (`Electrostatics_Sandbox.html`)](file:///dev/shm/EMT%20-%20Sims/Electrostatics_Sandbox.html)
- **Concept**: How electric charges ($q$) create electric fields ($\vec{E}$) in free space.
- **Features**:
  - Place positive ($+q$) and negative ($-q$) point charges anywhere in space.
  - Real-time 3D vector field arrows and stream lines.
  - Movable green **Test Charge ($q_0$)**: Drag around to observe net Coulomb force $\vec{F} = q_0 \vec{E}$, field magnitude $|\vec{E}|$, and electric potential $V(\vec{r})$.
  - Presets: Electric Dipole, Like Charges, Single Charge, Quadrupole.

### 3. 🧲 [Magnetostatics Sandbox (`Magnetostatics_Sandbox.html`)](file:///dev/shm/EMT%20-%20Sims/Magnetostatics_Sandbox.html)
- **Concept**: How electric currents ($I$) generate magnetic fields ($\vec{B}$) in space.
- **Features**:
  - Current Geometries: Straight Wire, Circular Wire Loop, Solenoid Coil.
  - Real-time 3D magnetic field concentric loops ($\vec{B}$).
  - Right-Hand Rule visualizer: Thumb along current $I$, fingers curl along $\vec{B}$.
  - Interactive compass probe observing magnetic flux density magnitude $|\vec{B}|$ and direction.

---

## 📚 Lecture-by-Lecture 3D Simulations

| Lecture | HTML File | Physics Concepts Visualized |
|---|---|---|
| **Portal Hub** | [index.html](file:///dev/shm/EMT%20-%20Sims/index.html) | Interactive Portal Menu linking all simulations & notes |
| **Vector Calculus** | [Vector_Calculus_Intuition.html](file:///dev/shm/EMT%20-%20Sims/Vector_Calculus_Intuition.html) | 3D visual intuition for Gradient ($\nabla V$), Divergence ($\nabla \cdot \vec{F}$), Curl ($\nabla \times \vec{F}$) |
| **Electrostatics Lab** | [Electrostatics_Sandbox.html](file:///dev/shm/EMT%20-%20Sims/Electrostatics_Sandbox.html) | Free space point charge placement, field vectors, test charge force |
| **Magnetism Lab** | [Magnetostatics_Sandbox.html](file:///dev/shm/EMT%20-%20Sims/Magnetostatics_Sandbox.html) | Straight current wire, loop, solenoid, Right-Hand Rule visualizer |
| **Lec 1** | [Lec1_Scalars_and_Vectors.html](file:///dev/shm/EMT%20-%20Sims/Lec1_Scalars_and_Vectors.html) | 3D Vector Addition ($\vec{A}+\vec{B}$), Dot Product, Cross Product |
| **Lec 2** | [Lec2_Coordinate_Systems.html](file:///dev/shm/EMT%20-%20Sims/Lec2_Coordinate_Systems.html) | Cartesian, Cylindrical, Spherical constant surfaces & position vectors |
| **Lec 3** | [Lec3_Electrostatics.html](file:///dev/shm/EMT%20-%20Sims/Lec3_Electrostatics.html) | Coulomb's Law, point charges, electric field intensity |
| **Lec 4** | [Lec4_Gauss_Law.html](file:///dev/shm/EMT%20-%20Sims/Lec4_Gauss_Law.html) | Gaussian surfaces (Sphere, Cylinder, Planar) & flux integration |
| **Lec 5** | [Lec5_Dielectric_Polarization.html](file:///dev/shm/EMT%20-%20Sims/Lec5_Dielectric_Polarization.html) | Atomic dipoles in field $\vec{E}_0$, polarization vector $\vec{P}$, bound charges |
| **Lec 6** | [Lec6_Potential_and_Work.html](file:///dev/shm/EMT%20-%20Sims/Lec6_Potential_and_Work.html) | Equipotential surfaces $V(r)$, test charge work integral $W = -q \int \vec{E}\cdot d\vec{l}$ |
| **Lec 7** | [Lec7_Poisson_and_Laplace.html](file:///dev/shm/EMT%20-%20Sims/Lec7_Poisson_and_Laplace.html) | 2D Finite Difference Method (FDM) grid potential heatmap solver |
| **Lec 8** | [Lec8_Electrostatic_Boundaries.html](file:///dev/shm/EMT%20-%20Sims/Lec8_Electrostatic_Boundaries.html) | Dielectric boundary refraction law $\frac{\tan\theta_1}{\tan\theta_2} = \frac{\epsilon_1}{\epsilon_2}$ |
| **Lec 9** | [Lec9_Magnetostatics.html](file:///dev/shm/EMT%20-%20Sims/Lec9_Magnetostatics.html) | Biot-Savart law, current wire, magnetic field $\vec{B}$, Ampere loop |
| **Lec 10** | [Lec10_Magnetic_Boundaries.html](file:///dev/shm/EMT%20-%20Sims/Lec10_Magnetic_Boundaries.html) | Magnetic boundary conditions ($\mu_1/\mu_2$), $B_n$ continuity, $H_t$ jump |
| **Lec 11** | [Lec11_Maxwell_and_EM_Waves.html](file:///dev/shm/EMT%20-%20Sims/Lec11_Maxwell_and_EM_Waves.html) | 3D Transverse Electromagnetic (TEM) wave propagation $\vec{E}(z,t)$ & $\vec{H}(z,t)$ |

---

## 📖 Master Course Notes

All lecture slides, derivations, vector identities, and boundary condition proofs are consolidated into:
- [EMT_Course_Notes.md](file:///dev/shm/EMT%20-%20Sims/EMT_Course_Notes.md)

---

## 🛠 Developer Setup & Dependencies

For developers or teammates looking to run Python conversion scripts:

### Using `uv` (Recommended)
```bash
uv venv .venv
source .venv/bin/activate
uv pip install markitdown pypdf pdfplumber pypdfium2 pytesseract
```

### Using `pip`
```bash
pip install -r requirements.txt
```

---

## 🎨 Aesthetic Theme Customization

Each interactive HTML page includes a **Theme Toggle** in the top navigation bar supporting:
1. 🌙 **Dark Mode** (GitHub Midnight - `#0d1117`)
2. ☀️ **Light Mode** (Academic Studio - `#f6f8fa`)
3. ⚡ **Cyberpunk Neon Mode** (High-Contrast Glow - `#030712`)
