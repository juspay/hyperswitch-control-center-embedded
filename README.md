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

Install the React wrapper (core is pulled in as a dependency):

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-react react react-dom
```

or with `pnpm`:

```bash
pnpm add @juspay-tech/hyperswitch-control-center-embed-react react react-dom
```

You still import and initialize the SDK using `loadHyperswitch` from the core package.

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
  url: 'https://app.hyperswitch.io/api',
  width: '100%',
  height: '500px'
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
        url="https://app.hyperswitch.io/api"
        width="100%"
        height="500px"
      />
    </HyperswitchProvider>
  );
}
```

For full API details, see the `core/README.md` and `react/README.md` files.

## Development (for contributors)

This repository uses `pnpm` for workspace management.

### Install dependencies

```bash
pnpm install
```

### Build all packages

```bash
pnpm run build
```

### Type check all packages

```bash
pnpm run type-check
```

### Build individual packages

```bash
pnpm run build:core
pnpm run build:react
```

### Clean build artifacts

```bash
pnpm run clean
```

## License

MIT
