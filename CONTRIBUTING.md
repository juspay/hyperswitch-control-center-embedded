# Contributing Guide

Thank you for your interest in contributing to Hyperswitch Control Center Embedded SDK!

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 9+

### Getting Started

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the packages:
   ```bash
   pnpm run build
   ```

## Project Structure

```
├── core/           # Vanilla JavaScript SDK
│   └── src/        # Core source files
├── react/          # React wrapper components
│   └── src/        # React source files
└── .github/        # GitHub workflows
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). This is **required** because our release process uses these commit messages to:

1. **Determine version bumps** automatically
2. **Generate CHANGELOG.md** entries
3. **Create semantic releases**

### Commit Message Format

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Version Impact |
|------|-------------|----------------|
| `feat` | A new feature | Minor (0.1.0) |
| `fix` | A bug fix | Patch (0.0.1) |
| `docs` | Documentation only changes | None |
| `style` | Code style changes (formatting, semicolons) | None |
| `refactor` | Code changes that neither fix bugs nor add features | None |
| `perf` | Performance improvements | Patch |
| `test` | Adding or modifying tests | None |
| `chore` | Changes to build process or auxiliary tools | None |
| `ci` | CI/CD configuration changes | None |

### Breaking Changes

For breaking changes, use `!` after the type or include `BREAKING CHANGE:` in the footer:

```bash
# Using ! notation
feat!: remove deprecated API method

# Using BREAKING CHANGE footer
feat: add new initialization options

BREAKING CHANGE: The `init()` method now requires a `config` object.
```

### Examples

```bash
# Feature (triggers minor version bump)
feat: add support for custom themes

# Bug fix (triggers patch version bump)
fix: resolve iframe communication timeout

# Scoped change
fix(core): handle postMessage serialization errors

# Documentation (no version bump)
docs: update installation instructions

# Breaking change (triggers major version bump)
feat!: change HyperswitchProvider props API

BREAKING CHANGE: `HyperswitchProvider` now requires `config` prop instead of `hyperswitchInstance`.
```

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the commit convention
3. **Ensure build passes**:
   ```bash
   pnpm run build
   pnpm run type-check
   ```
4. **Open a pull request** to `main`
5. **Wait for CI** to pass
6. **Squash and merge** with a proper commit message

### PR Title Convention

PR titles should follow the same convention as commit messages:

```
feat: add support for custom themes
fix: resolve iframe communication timeout
docs: update API documentation
```

## Code Style

- Use TypeScript for all source files
- Follow existing code formatting
- Keep functions small and focused
- Add JSDoc comments for public APIs

## Questions?

Open an issue for bugs, features, or questions.