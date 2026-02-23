# @juspay-tech/hyperswitch-control-center-embed-react

React components for embedding Hyperswitch control center components into React applications.

## Overview

This package provides React components (`HyperswitchProvider`, `ConnectorConfiguration`) that wrap the core SDK. The core package is included as an internal dependency — you only need to install the React package. You still use `loadHyperswitch` from the core package to initialize the SDK.

## Installation

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-react
```

The core package is installed automatically — no separate installation required.

## Imports

```jsx
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';
import { HyperswitchProvider, ConnectorConfiguration } from '@juspay-tech/hyperswitch-control-center-embed-react';
```

## Basic Usage

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
      <ConnectorConfiguration url="https://app.hyperswitch.io/api" />
    </HyperswitchProvider>
  );
}
```

## Optional Customization

You can customize the appearance by passing a theme configuration:

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
      <ConnectorConfiguration url="https://app.hyperswitch.io/api" />
    </HyperswitchProvider>
  );
}
```

All fields in `initConfig` are optional. Omitting them uses the default Control Center theme.

## API Reference

### Exports

| Export | Description |
|--------|-------------|
| `HyperswitchProvider` | Provider component wrapping the app |
| `ConnectorConfiguration` | Pre-built connector configuration component |
| `useHyperswitchInstance` | Hook to access the raw `Hyperswitch` instance |

### `HyperswitchProvider` Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `hyperswitchInstance` | `Hyperswitch` | Yes | Instance returned by `loadHyperswitch()` |
| `children` | `ReactNode` | Yes | Child components |

### `ConnectorConfiguration` Props

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
