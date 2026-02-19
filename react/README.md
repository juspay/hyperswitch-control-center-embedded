@juspay-tech/hyper-dashboard-embed-react

**Hyperswitch Dashboard Embed - React** - React components for Hyperswitch embedded SDK.

## Installation

```bash
npm install @juspay-tech/hyper-dashboard-embed-react
```

This package requires React 18+ and the core package as peer dependencies.

## Usage

```jsx
import { HyperswitchProvider, useHyperswitchInstance } from '@juspay-tech/hyper-dashboard-embed-react';

function App() {
  const hyperswitch = loadHyperswitch(yourConfig);

  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <YourComponents />
    </HyperswitchProvider>
  );
}

function YourComponents() {
  const hyperswitch = useHyperswitchInstance();
  
  // Use Hyperswitch
  return <div>Your content</div>;
}
```

## Components

### HyperswitchProvider
Provides the Hyperswitch instance to child components.

### ConnectorConfiguration
Embedded connector configuration component.

## Features

- React components with hooks
- TypeScript support
- Context-based SDK access
- Built-in cleanup on unmount

## License

ISC