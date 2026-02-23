# @juspay-tech/hyperswitch-control-center-embed-core

Core JavaScript SDK for embedding Hyperswitch control center components into your web application.

## Overview

The `loadHyperswitch` function is the main entry point for initializing embedded Hyperswitch components. It loads components via an iframe and requires a `fetchToken` function that calls your backend to retrieve an embedded token. You can optionally pass a theme configuration to customize the appearance of the embedded UI.

## Installation

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-core
```

## Import

### ES Module (Recommended)

```javascript
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';
```

### CommonJS

```javascript
const { loadHyperswitch } = require('@juspay-tech/hyperswitch-control-center-embed-core');
```

## Basic Usage

Initialize the SDK by providing a `fetchToken` function:

```javascript
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
```

## Optional Customization

You can customize the appearance by passing a theme configuration:

```javascript
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
```

All fields in `initConfig` are optional. Omitting them uses the default Control Center theme.

## Creating a Component

Create an embeddable component instance:

```javascript
const connectors = hyperswitch.create('connectors', { 
  url: 'https://app.hyperswitch.io/api' 
});
```

Available component: `connectors`

## Mounting

Mount the component into a container element in your HTML:

```html
<div id="hyperswitch-root"></div>
```

```javascript
connectors.mount('#hyperswitch-root');
```

## API Reference

### `loadHyperswitch(options)`

Returns a `Hyperswitch` instance.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fetchToken` | `() => Promise<string \| undefined>` | Yes | Async function that fetches the embedded token from your backend |
| `initConfig` | `MerchantTheme` | No | Theme customization object |

### `MerchantTheme`

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

### `Hyperswitch.create(name, options)`

Creates a component instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Component name (e.g., `'connectors'`) |
| `options.url` | `string` | Base URL for the embedded component |

### `.mount(selector)`

Mounts the component to a DOM element matching the given CSS selector.

## Documentation

For more details and examples, see the [Integration Guide](https://docs.hyperswitch.io/explore-hyperswitch/account-management/beta-embeddable-components/integration-guide).

## License

MIT