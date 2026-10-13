# @juspay-tech/hyperswitch-control-center-embed-core

[![npm version](https://img.shields.io/npm/v/@juspay-tech/hyperswitch-control-center-embed-core.svg)](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-core)

The core JavaScript SDK for Hyperswitch Control Center embedded components. It lets you add Control Center functionality, such as connector configuration, payments and refunds, to your own website.

This package contains the initialization logic for embedded components along with the related TypeScript types. It has no framework dependency. If you use React, see [`@juspay-tech/hyperswitch-control-center-embed-react`](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-react).

## Installation

```sh
npm install @juspay-tech/hyperswitch-control-center-embed-core
```

or with `pnpm`:

```sh
pnpm add @juspay-tech/hyperswitch-control-center-embed-core
```

## Documentation

- [Integration Guide](https://docs.hyperswitch.io/explore-hyperswitch/account-management/beta-embeddable-components/integration-guide)
- [API reference](#api-reference)

## Usage

Embedded components authenticate with a short-lived embedded token. Your server requests the token from Hyperswitch with your API key, and the SDK retrieves it from your server through a `fetchToken` function that you provide. Your API key is never exposed to the browser.

### Issue an embedded token on your server

Add an endpoint to your server that calls the Hyperswitch embedded token API and returns the token.

```js
// GET /api/get-embedded-token
app.get('/api/get-embedded-token', async (req, res) => {
  const response = await fetch(`${process.env.HYPERSWITCH_API_URL}/embedded/token`, {
    headers: {
      'api-key': process.env.HYPERSWITCH_API_KEY,
      'x-profile-id': process.env.HYPERSWITCH_PROFILE_ID,
    },
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'Unable to issue an embedded token.' });
  }

  const { token } = await response.json();
  res.json({ token });
});
```

The token is scoped to the business profile passed in `x-profile-id`.

### `loadHyperswitch`

This synchronous function takes a function that retrieves the embedded token from your server, along with optional [appearance settings](#customizing-the-appearance). It returns a `Hyperswitch` instance.

```js
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';

const fetchToken = async () => {
  // Fetch the embedded token by making an API call to your server
  const response = await fetch('/api/get-embedded-token');
  const { token } = await response.json();
  return token;
};

const hyperswitch = loadHyperswitch({ fetchToken });
```

`fetchToken` is called when the instance is created, and again whenever the token expires.

The package also supports CommonJS:

```js
const { loadHyperswitch } = require('@juspay-tech/hyperswitch-control-center-embed-core');
```

### Creating and mounting a component

Create a component from the instance and mount it to an element on your page.

```html
<div id="hyperswitch-root"></div>
```

```js
const payments = hyperswitch.create('payments', {
  url: 'https://app.hyperswitch.io',
});

payments.mount('#hyperswitch-root');
```

To remove a component, call `payments.destroy()`.

### Supported components

| Name | Description |
|------|-------------|
| `connectors` | Connector configuration |
| `payments` | Payments list and payment details |
| `refunds` | Refunds list and refund details |

Multiple components can be created from a single instance.

### Environments

The `url` option is the base URL of the Control Center that serves the components. The embedded token must be issued by the same environment.

| Environment | `url` | Token API base URL |
|-------------|-------|--------------------|
| Sandbox | `https://app.hyperswitch.io` | `https://app.hyperswitch.io/api` |
| Production | `https://live.hyperswitch.io` | `https://live.hyperswitch.io/api` |

### Customizing the appearance

Pass a theme configuration as `initConfig` to match the components to your brand.

```js
const hyperswitch = loadHyperswitch({
  fetchToken,
  initConfig: {
    primaryColor: '#0066ff',
    backgroundColor: '#ffffff',
    buttons: {
      primary: {
        backgroundColor: '#0066ff',
        textColor: '#ffffff',
        hoverBackgroundColor: '#0052cc',
      },
      secondary: {
        backgroundColor: '#f0f0f0',
        textColor: '#333333',
        hoverBackgroundColor: '#e0e0e0',
      },
    },
  },
});
```

All fields in `initConfig` are optional. Omitted fields use the default Control Center theme. See [`MerchantTheme`](#merchanttheme) for the complete list.

### Modals

Modals opened inside a component are displayed over the full host page. While a modal is open, the SDK stretches the component's iframe across the window and locks page scrolling, and restores both when the modal closes.

To keep modals inside the component, set `fullPageModals` to `false`:

```js
const payments = hyperswitch.create('payments', {
  url: 'https://app.hyperswitch.io',
  fullPageModals: false,
});
```

Full-page modals rely on `position: fixed`. If an ancestor of the mount point has a CSS `transform`, `filter`, `perspective` or `contain`, or creates a stacking context below other page content, the modal can be clipped or covered. Set `fullPageModals` to `false` in that layout.

### Content Security Policy

If you have deployed a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), include the Control Center origin in your `frame-src` directive.

## API reference

### `loadHyperswitch(options)`

Returns a `Hyperswitch` instance.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fetchToken` | `() => Promise<string \| undefined>` | Yes | Async function that fetches the embedded token from your server |
| `initConfig` | [`MerchantTheme`](#merchanttheme) | No | Theme customization object |

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

### `hyperswitch.create(name, options)`

Creates a component instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `'connectors' \| 'payments' \| 'refunds'` | The component to create |
| `options` | [`ElementOptions`](#elementoptions) | Component options |

### `ElementOptions`

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | Base URL of the Control Center that serves the component |
| `width?` | `string` | Width of the component container. Defaults to `100%` |
| `height?` | `string` | Initial height of the component container. The component resizes to fit its content |
| `className?` | `string` | Additional class names for the component container |
| `style?` | `Partial<CSSStyleDeclaration>` | Inline styles for the component container |
| `fullPageModals?` | `boolean` | Display modals over the full host page. Defaults to `true` |
| `onResize?` | `(dimensions: { width: number; height: number }) => void` | Called when the component is resized |

### `component.mount(target)`

Mounts the component to a DOM element. `target` is a CSS selector or an `HTMLElement`. Returns the component.

### `component.destroy()`

Removes the component from the page and cleans up its event listeners.

## TypeScript support

This package includes TypeScript declarations. The following types are exported:

```ts
import type {
  HyperswitchInitOptions,
  ElementOptions,
  MerchantTheme,
} from '@juspay-tech/hyperswitch-control-center-embed-core';
```

## License

MIT
