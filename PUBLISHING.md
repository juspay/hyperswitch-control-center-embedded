# Publishing Guide

This is a test repository for practicing public npm publishing with the Hyperswitch Dashboard Embed SDK.

## Overview

This monorepo contains two packages:
- `@juspay-tech/hyper-dashboard-embed-core` - Core JavaScript SDK
- `@juspay-tech/hyper-dashboard-embed-react` - React components (depends on core)

## Publishing Steps

### 1. Enable Two-Factor Authentication (2FA)

If you haven't already, enable 2FA for your npm account:
```bash
npm profile enable-2fa
```

Follow the prompts to set up authenticator app or SMS-based 2FA.

### 2. Login to npm

```bash
pnpm login
```

Or you can use `npm login` - pnpm uses the npm registry by default.

Enter your npm username, password, and OTP (One-Time Password).

### 3. Build the packages

```bash
pnpm run build
```

This will build both packages and verify types.

### 4. Publish the core package first

The core package must be published first since the react package depends on it.

```bash
cd core
pnpm publish --access public
```

You'll need to enter your OTP during publishing.

### 5. Publish the react package

```bash
cd ../react
pnpm publish --access public
```

Again, enter your OTP when prompted.

**Alternative: Publish from root using filters**

You can also publish from the root directory using pnpm's filter feature:

```bash
# From root directory
pnpm --filter @juspay-tech/hyper-dashboard-embed-core publish --access public
pnpm --filter @juspay-tech/hyper-dashboard-embed-react publish --access public
```

## Verification

After publishing, verify the packages are available:

```bash
pnpm view @juspay-tech/hyper-dashboard-embed-core
pnpm view @juspay-tech/hyper-dashboard-embed-react
```

Or use `npm view` - both work the same way.

## Unpublishing (within 72 hours)

If you want to remove the packages (within 72 hours of publishing):

```bash
pnpm unpublish @juspay-tech/hyper-dashboard-embed-react@1.0.0 --force
pnpm unpublish @juspay-tech/hyper-dashboard-embed-core@1.0.0 --force
```

**Note:** After 72 hours, you cannot unpublish a package. You can only deprecate it.

## Deprecating (anytime)

To mark a package as deprecated without removing it:

```bash
pnpm deprecate @juspay-tech/hyper-dashboard-embed-core "No longer maintained"
pnpm deprecate @juspay-tech/hyper-dashboard-embed-react "No longer maintained"
```

## Troubleshooting

### E401 Unauthorized
- Check that you're logged in: `pnpm whoami` (or `npm whoami`)
- Verify your OTP is correct

### E403 Forbidden
- Verify the package name is unique
- Check that 2FA is enabled on your account

### Publishing fails due to dependency
- Always publish core before react
- Ensure core package is accessible

## Local Testing

Before publishing, you can test locally:

```bash
# Create tarballs
cd core && pnpm pack
cd ../react && pnpm pack

# Test installation from local tarballs
mkdir test-project && cd test-project
pnpm install ../core/juspay-tech-hyper-dashboard-embed-core-1.0.0.tgz
pnpm install ../react/juspay-tech-hyper-dashboard-embed-react-1.0.0.tgz
```

## Next Version Publishing

When publishing a new version, you have two options:

### Option 1: Using pnpm version (Recommended)

This automatically updates versions and creates a git commit:

```bash
# From root directory
# For a patch version (1.0.0 -> 1.0.1)
pnpm -r version patch

# For a minor version (1.0.0 -> 1.1.0)
pnpm -r version minor

# For a major version (1.0.0 -> 2.0.0)
pnpm -r version major

# Or specify exact version
pnpm -r version 1.1.0
```

**Important:** After running `pnpm version`, you need to update the react package's dependency on core:

```bash
# Update react's dependency to match the new core version
cd react
pnpm add @juspay-tech/hyper-dashboard-embed-core@latest --save-prod
cd ..
```

Then build and publish:
```bash
pnpm run build
pnpm --filter @juspay-tech/hyper-dashboard-embed-core publish --access public
pnpm --filter @juspay-tech/hyper-dashboard-embed-react publish --access public
```

### Option 2: Manual Version Update

1. Update version numbers manually in `core/package.json` and `react/package.json`
2. Update `react/package.json` dependency: `"@juspay-tech/hyper-dashboard-embed-core": "^1.1.0"` (match the new core version)
3. Build: `pnpm run build`
4. Publish core: `pnpm --filter @juspay-tech/hyper-dashboard-embed-core publish --access public`
5. Publish react: `pnpm --filter @juspay-tech/hyper-dashboard-embed-react publish --access public`

## Security Note

These are production packages. Ensure no sensitive information is included before publishing.