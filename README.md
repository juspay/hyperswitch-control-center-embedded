# Hyperswitch Control Center Embedded SDK

A monorepo containing two packages for embedding Hyperswitch components into your application:

- **`@juspay-tech/hyper-dashboard-embed-core`** - Vanilla JavaScript SDK (no React required)
- **`@juspay-tech/hyper-dashboard-embed-react`** - React wrapper components

## Packages

### Core Package (Vanilla JS)
- **Package name**: `@juspay-tech/hyper-dashboard-embed-core`
- **No dependencies**: Works in any JavaScript environment
- **Use when**: Building with vanilla JS, Vue, Angular, or any non-React framework

### React Package
- **Package name**: `@juspay-tech/hyper-dashboard-embed-react`
- **Dependencies**: Requires React 18+ and the core package
- **Use when**: Building a React application

## Quick Start

### Vanilla JavaScript

```javascript
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';

const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    const response = await fetch('/api/token');
    const data = await response.json();
    return data.token;
  }
});

const element = hyperswitch.create('connectors', {
  url: 'https://your-hyperswitch-server.com',
  width: '100%',
  height: '600px'
});

element.mount('#container');
```

### React

```jsx
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';
import { HyperswitchProvider, ConnectorConfiguration } from '@juspay-tech/hyper-dashboard-embed-react';

const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    const response = await fetch('/api/token');
    const data = await response.json();
    return data.token;
  }
});

function App() {
  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <ConnectorConfiguration 
        url="https://your-hyperswitch-server.com"
        width="100%"
        height="600px"
      />
    </HyperswitchProvider>
  );
}
```

## Installation

### From GitHub (Not Published to npm Yet)

```bash
# Core package (vanilla JS)
npm install git+https://github.com/your-username/hyperswitch-control-center-embedded.git#core

# React package
npm install git+https://github.com/your-username/hyperswitch-control-center-embedded.git#react
```

### Local Development (npm link)

```bash
# In SDK monorepo
cd core && npm link
cd ../react && npm link

# In your application
npm link @juspay-tech/hyper-dashboard-embed-core
npm link @juspay-tech/hyper-dashboard-embed-react
```

## Documentation

- **[INTEGRATION.md](./INTEGRATION.md)** - Complete integration guide with all installation methods and examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture and design documentation

## Features

- ✅ **Vanilla JS support** - No React required for core package
- ✅ **React support** - React components available as separate package
- ✅ **Automatic token management** - Handles token refresh automatically
- ✅ **TypeScript support** - Full type definitions included
- ✅ **Multiple build formats** - UMD, ESM, and CommonJS

## Requirements

- **Core package**: None (works in any JavaScript environment)
- **React package**: React 18.x - 20.x

## Development

```bash
# Install dependencies
npm install

# Build both packages
npm run build

# Build individually
npm run build:core
npm run build:react

# Type check
npm run type-check
```

## License

ISC
