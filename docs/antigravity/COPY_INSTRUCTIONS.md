# Copying this overlay into the DSH fork

Copy files into the repository root while preserving existing files.

Never blindly overwrite:

- `AGENTS.md` or package `AGENTS.md`
- `CLAUDE.md` symlinks
- `.gitignore`
- `package.json`, `pnpm-lock.yaml`, workspace manifests
- `.github/`
- existing `.agents` customizations without a merge review

After copying, merge gitignore patterns, inspect `git status`, run the validator and hook tests, then review every new file before committing. The pack does not create a branch, commit, push, install dependencies, or enable runtime services.
