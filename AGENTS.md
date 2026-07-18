# AGENTS.md

## Cursor Cloud specific instructions

- As of this writing, the `main` branch of this repository is a placeholder. It
  contains only `README.md` (a single title line) and this `AGENTS.md`. There is
  **no application code, dependency manifest, build system, or service** to run.
- There is nothing to install, build, lint, test, or start. No package manager,
  language runtime, database, or dev server is configured.
- The update script is intentionally a no-op (`true`) because there are no
  dependencies to refresh. Do not add install/build/service steps to it until
  real project code with a dependency manifest lands.
- Other branches (e.g. `origin/cursor/advanced-seo-audit-excel-*`,
  `origin/cursor/seo-audit-liftthecity-*`, `origin/cursor/laptop-cleanup-boost-*`)
  contain document artifacts (SEO audit `.docx`/`.xlsx`/`.html`/`.csv`) and a
  Windows `.bat` script — not a runnable application.
- When real application code is added, revisit this file and the update script to
  document the actual setup, lint, test, build, and run commands.
