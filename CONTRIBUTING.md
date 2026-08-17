# Contributing to @gnaws/viewer

Thank you for your interest in contributing!

## Branches

- `main` — stable, tagged releases only. Never push directly.
- `dev` — integration branch. Target this branch for all PRs.
- Feature branches — create from `dev`, name them `feat/your-thing` or `fix/your-thing`.

```
your-branch  →  PR  →  dev  →  (release PR)  →  main
```

Hotfixes for critical bugs branch from `main` directly:

```
hotfix/critical-bug  →  PR  →  main  (tagged immediately)
                     →  also merged into dev to stay in sync
```

## Workflow

1. Fork the repo
2. Create a branch from `dev`:
   ```bash
   git checkout dev
   git checkout -b feat/your-feature
   ```
3. Make your changes — commit style is your choice, we'll clean up at merge time
4. Open a PR targeting `dev`
5. Describe **what** you changed and **why**

We squash small PRs and use merge commits for larger features with meaningful history.
No need to rebase or squash before opening a PR.

## Commit messages (for your own commits)

We use [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add node tooltip on hover
fix: handle empty graph gracefully
docs: improve README examples
chore: bump dependencies
```

## Development setup

```bash
git clone git@github.com:FabioDominio/gnaws-viewer.git
cd gnaws-viewer

npm install
npm run dev -- --graph path/to/graph.json
npm run build
```

## Code style

- TypeScript strict mode
- ESLint enforced — run `npm run lint` before pushing
- No `any` without a comment explaining why

## License

By contributing you agree your code is licensed under AGPL-3.0.
