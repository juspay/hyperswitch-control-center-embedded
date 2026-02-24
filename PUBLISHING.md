# Publishing Guide

This document describes how to publish new versions of the Hyperswitch Control Center Embedded SDK packages.

## Prerequisites

- Push access to the `main` branch
- GitHub Actions enabled for the repository
- NPM_TOKEN secret configured in GitHub repository secrets

## Release Process

### 1. Ensure All Changes Are Merged

All changes should be merged to `main` via pull requests with proper commit messages following [Conventional Commits](https://www.conventionalcommits.org/).

### 2. Trigger the Release Workflow

1. Go to the **Actions** tab in GitHub
2. Select the **"Create a release"** workflow
3. Click **"Run workflow"**
4. The workflow will:
   - Analyze commits since the last release
   - Determine the new version using semantic versioning
   - Update CHANGELOG.md
   - Update version in both `core/package.json` and `react/package.json`
   - Create a git tag
   - Publish both packages to npm
   - Create a GitHub Release

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning:

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `feat:` | Minor (0.1.0) | `feat: add new payment method support` |
| `fix:` | Patch (0.0.1) | `fix: resolve iframe resize issue` |
| `feat!:` or `BREAKING CHANGE:` | Major (1.0.0) | `feat!: change API signature` |
| `docs:`, `chore:`, `refactor:` | No release | `docs: update README` |

### Commit Message Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Examples

**Feature (minor version):**
```
feat: add support for Apple Pay integration
```

**Bug fix (patch version):**
```
fix: resolve token refresh timing issue
```

**Breaking change (major version):**
```
feat!: rename loadHyperswitch to initHyperswitch

BREAKING CHANGE: The `loadHyperswitch` function has been renamed to `initHyperswitch`.
Update your imports accordingly.
```

**Scoped change:**
```
fix(core): handle iframe postMessage errors gracefully
```

## Version Determination

The version is automatically determined by [cocogitto](https://github.com/cocogitto/cocogitto) based on commit history:

- **Patch release**: Only `fix:` commits since last release
- **Minor release**: At least one `feat:` commit (without breaking changes)
- **Major release**: At least one `BREAKING CHANGE` or `feat!:` type commit

## Manual Publishing (Emergency)

If GitHub Actions is unavailable, you can publish manually:

```bash
# Install dependencies
pnpm install

# Build packages
pnpm run build

# Publish core package
cd core
npm publish --access public
cd ..

# Publish react package
cd react
npm publish --access public
```

**Note:** Ensure both packages have the same version number before publishing manually.

## Troubleshooting

### Release workflow fails

1. Check that `NPM_TOKEN` secret is configured in repository settings
2. Verify the token has publish permissions for `@juspay-tech` scope
3. Check that you're running the workflow from `main` branch

### Version mismatch between packages

The release workflow automatically syncs versions. If they're out of sync:
1. Manually update both `package.json` files to the same version
2. Commit and push to `main`
3. Trigger a new release

### NPM publish fails

1. Check if the version already exists on npm
2. Verify NPM_TOKEN has not expired
3. Check npm registry status at https://status.npmjs.org/