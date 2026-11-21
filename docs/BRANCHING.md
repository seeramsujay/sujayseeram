# Branching model

| Branch | What lives there | Deploys? |
| :--- | :--- | :--- |
| `main` | The live site (`site/`) plus the tooling that feeds it | Yes, `site/` only |
| `v2` | Next-gen Vite + three.js build (was `v2/`), files at branch root | No (preview deploys only) |
| `v3` | v2 plus WebGL fluid effects (was `v3/`), files at branch root | No (preview deploys only) |
| `archive/v1` | Older v1 snapshot (was `v1/`), read-only | No |
| tag `pre-restructure` | `main` exactly as it was before the cleanup | n/a |

The version branches were made with `git subtree split`, so each one keeps the
full commit history of its old folder.

## Day-to-day

- **Small fix to the live site:** branch off `main` (`fix/…`, `perf/…`), open a PR into `main`.
- **Work on a new version:** branch off `v2` or `v3` (`feat/v3-…`), PR back into that branch.
  ```bash
  git switch v3
  pnpm install && pnpm dev
  ```
- **Never** copy version folders back into `main`. When a version is ready to replace the
  live site, it gets promoted (below).

## Promoting a version to live

1. On the version branch, run `pnpm build` and check `dist/` with
   `node tools/perf-check.mjs --root dist` (copy the script over or run it from a `main` checkout).
   It must meet the budgets in [PERFORMANCE.md](PERFORMANCE.md) on the phone profile.
2. On `main`, open a branch `release/vN`, replace the contents of `site/` with the build output
   (or switch `netlify.toml` to build the Vite app), and keep `tools/manage_projects.py` writing
   into wherever the new version reads project data from.
3. Tag the outgoing site (`git tag site-v1-final`) before merging, so it can be restored in one step.

## Data shared across versions

`projects_db.json` on `main` is the source of truth. `v2`/`v3` keep a copy at
`src/data/projects_db.json`; refresh it from `main` when you start a work session:

```bash
git switch v3
git checkout main -- projects_db.json && mv projects_db.json src/data/projects_db.json
```
