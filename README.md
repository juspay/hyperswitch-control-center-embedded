# Hyperswitch Embedded SDK

A monorepo containing two packages for embedding components into your application:

- **`@juspay-tech/hyper-dashboard-embed-core`** - Vanilla JavaScript SDK (no React required)
- **`@juspay-tech/hyper-dashboard-embed-react`** - React wrapper components

## Installation

### Core package (vanilla JS)
```bash
npm install @juspay-tech/hyper-dashboard-embed-core
```

### React package
```bash
npm install @juspay-tech/hyper-dashboard-embed-react
```

## Usage

### Core Package (Vanilla JS)
- **Package name**: `@juspay-tech/hyper-dashboard-embed-core`
- **No dependencies**: Works in any JavaScript environment

```javascript
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';

const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    // Fetch your authentication token
    const response = await fetch('/api/get-token');
    const data = await response.json();
    return data.token;
  }
});

const element = hyperswitch.create('connectors', {
  url: 'https://your-server.com',
  width: '100%',
  height: '500px'
});

element.mount('#container');
```

### React Package
- **Package name**: `@juspay-tech/hyper-dashboard-embed-react`
- **Dependencies**: Requires React 18+ and the core package

```jsx
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';
import { HyperswitchProvider, ConnectorConfiguration } from '@juspay-tech/hyper-dashboard-embed-react';

function App() {
  const hyperswitch = loadHyperswitch({
    fetchToken: async () => {
      const response = await fetch('/api/get-token');
      const data = await response.json();
      return data.token;
    }
  });

  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <ConnectorConfiguration
        url="https://your-server.com"
        width="100%"
        height="500px"
      />
    </HyperswitchProvider>
  );
}
```

## Development

### Install dependencies
```bash
npm install
```

### Build all packages
```bash
npm run build
```

### Build individual packages
```bash
npm run build:core
npm run build:react
```

### Clean build artifacts
```bash
npm run clean
```

### Type checking
```bash
npm run type-check
```

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for detailed publishing instructions.

## License

ISC