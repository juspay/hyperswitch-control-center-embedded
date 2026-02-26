# @juspay-tech/hyperswitch-control-center-embed-react

React components for embedding Hyperswitch Control Center components into React applications.

## Overview

Official React bindings for the Hyperswitch Control Center embeddable SDK. Use `HyperswitchProvider` and `ConnectorConfiguration` to render Control Center flows (e.g. connector configuration) inside your React app. The core SDK is included as a dependency; initialize the embed with `loadHyperswitch` from the core package and pass the instance into the provider.

## Installation

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-react
```

or with `pnpm`:

```bash
pnpm add @juspay-tech/hyperswitch-control-center-embed-react
```

## Imports

```jsx
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';
import {
  HyperswitchProvider,
  ConnectorConfiguration
} from '@juspay-tech/hyperswitch-control-center-embed-react';
```

## Basic usage

Wrap your app with `HyperswitchProvider` and use the `ConnectorConfiguration` component:

```jsx
const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    // Call your backend endpoint to get the embedded token
    const response = await fetch('https://your-api.com/embedded/hyperswitch', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.token;
  }
});

function App() {
  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <ConnectorConfiguration url="https://app.hyperswitch.io" />
    </HyperswitchProvider>
  );
}
```

## Optional customization

You can customize the appearance by passing a theme configuration (same shape as the core SDK `MerchantTheme`):

```jsx
const initConfig = {
  primaryColor: '#0066ff',
  backgroundColor: '#ffffff',
  buttons: {
    primary: {
      backgroundColor: '#0066ff',
      textColor: '#ffffff',
      hoverBackgroundColor: '#0052cc'
    },
    secondary: {
      backgroundColor: '#f0f0f0',
      textColor: '#333333',
      hoverBackgroundColor: '#e0e0e0'
    }
  }
};

const hyperswitch = loadHyperswitch({
  fetchToken: async () => { /* ... */ },
  initConfig
});

function App() {
  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <ConnectorConfiguration url="https://app.hyperswitch.io" />
    </HyperswitchProvider>
  );
}
```

All fields in `initConfig` are optional. Omitting them uses the default Control Center theme.

## API reference

### Exports

| Export | Description |
|--------|-------------|
| `HyperswitchProvider` | Provider component that supplies the Hyperswitch embed instance to the tree |
| `ConnectorConfiguration` | Component that renders the connector configuration UI |

### `HyperswitchProvider` props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `hyperswitchInstance` | `Hyperswitch` | Yes | Instance returned by `loadHyperswitch()` |

### `ConnectorConfiguration` props

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | Base URL for the embedded component |

### `MerchantTheme` (for `initConfig`)

| Property | Type | Description |
|----------|------|-------------|
| `primaryColor?` | `string` | Primary accent color |
| `backgroundColor?` | `string` | Page background color |
| `buttons?.primary?` | `object` | Primary button styling |
| `buttons?.primary?.backgroundColor?` | `string` | Primary button background color |
| `buttons?.primary?.textColor?` | `string` | Primary button text color |
| `buttons?.primary?.hoverBackgroundColor?` | `string` | Primary button hover color |
| `buttons?.secondary?` | `object` | Secondary button styling |
| `buttons?.secondary?.backgroundColor?` | `string` | Secondary button background color |
| `buttons?.secondary?.textColor?` | `string` | Secondary button text color |
| `buttons?.secondary?.hoverBackgroundColor?` | `string` | Secondary button hover color |

## Documentation

For more details and examples, see the [Integration Guide](https://docs.hyperswitch.io/explore-hyperswitch/account-management/beta-embeddable-components/integration-guide).

## License

MIT
