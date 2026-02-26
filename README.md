# Hyperswitch Control Center Embedded SDK

Monorepo for the Hyperswitch Control Center embeddable SDKs.

This repo contains two publishable packages:

- **`@juspay-tech/hyperswitch-control-center-embed-core`** – Vanilla JavaScript SDK (no React required)
- **`@juspay-tech/hyperswitch-control-center-embed-react`** – React components built on top of the core SDK

Each package also has its own README with more in‑depth usage and API reference.

## Packages

| Package | Description | When to use |
|--------|-------------|-------------|
| `@juspay-tech/hyperswitch-control-center-embed-core` | Low-level JavaScript SDK that loads Control Center via iframes | Any JS app (framework-agnostic) |
| `@juspay-tech/hyperswitch-control-center-embed-react` | React components wrapping the core SDK | React 18+ apps that prefer JSX components |

## Installation (for consumers)

### Core package (vanilla JS)

Install the core SDK:

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-core
```

or with `pnpm`:

```bash
pnpm add @juspay-tech/hyperswitch-control-center-embed-core
```

### React package

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-react
```

or with `pnpm`:

```bash
pnpm add @juspay-tech/hyperswitch-control-center-embed-react
```

The core package is included as a dependency. Import and initialize with `loadHyperswitch` from the core package.

## Quick usage

### Core package (vanilla JS)

```javascript
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';

const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    // Fetch your authentication token from your backend
    const response = await fetch('/api/get-embedded-token');
    const data = await response.json();
    return data.token;
  }
});

const connectors = hyperswitch.create('connectors', {
  url: 'https://app.hyperswitch.io'
});

connectors.mount('#hyperswitch-root');
```

### React package

```jsx
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';
import {
  HyperswitchProvider,
  ConnectorConfiguration
} from '@juspay-tech/hyperswitch-control-center-embed-react';

const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    const response = await fetch('/api/get-embedded-token');
    const data = await response.json();
    return data.token;
  }
});

function App() {
  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <ConnectorConfiguration
        url="https://app.hyperswitch.io"
      />
    </HyperswitchProvider>
  );
}
```

For full API details, see the `core/README.md` and `react/README.md` files.

## Development (for contributors)

This repository uses `pnpm` workspaces. Install dependencies with `pnpm install`. The scripts below can be run with either `npm run <script>` or `pnpm run <script>`.

### Install dependencies

```bash
pnpm install
```

### Build all packages

```bash
npm run build
# or: pnpm run build
```

### Type check all packages

```bash
npm run type-check
# or: pnpm run type-check
```

### Build individual packages

```bash
npm run build:core
npm run build:react
# or: pnpm run build:core  /  pnpm run build:react
```

### Clean build artifacts

```bash
npm run clean
# or: pnpm run clean
```

## License

MIT
