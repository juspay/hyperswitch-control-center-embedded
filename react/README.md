# @juspay-tech/hyperswitch-control-center-embed-react

[![npm version](https://img.shields.io/npm/v/@juspay-tech/hyperswitch-control-center-embed-react.svg)](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-react)

React components for Hyperswitch Control Center embedded components.

This package is a thin React wrapper around [`@juspay-tech/hyperswitch-control-center-embed-core`](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-core). It lets you add embedded components, such as connector configuration, payments and refunds, to any React app, and manages their lifecycle for you.

## Requirements

The minimum supported version of React is v18.

## Installation

```sh
npm install @juspay-tech/hyperswitch-control-center-embed-react
```

or with `pnpm`:

```sh
pnpm add @juspay-tech/hyperswitch-control-center-embed-react
```

The core package is installed as a dependency.

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

### Render a component

Initialize the SDK with `loadHyperswitch` from the core package, then wrap your components with `HyperswitchProvider` to make the instance available to them.

```jsx
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';
import {
  HyperswitchProvider,
  Payments,
  Refunds,
} from '@juspay-tech/hyperswitch-control-center-embed-react';

const fetchToken = async () => {
  // Fetch the embedded token by making an API call to your server
  const response = await fetch('/api/get-embedded-token');
  const { token } = await response.json();
  return token;
};

const hyperswitch = loadHyperswitch({ fetchToken });

const App = () => (
  <HyperswitchProvider hyperswitchInstance={hyperswitch}>
    <Payments url="https://app.hyperswitch.io" />
    <Refunds url="https://app.hyperswitch.io" />
  </HyperswitchProvider>
);
```

`fetchToken` is called when the instance is created, and again whenever the token expires. Create the instance once, outside of your component's render.

### Supported components

| Component | Description |
|-----------|-------------|
| `ConnectorConfiguration` | Connector configuration |
| `Payments` | Payments list and payment details |
| `Refunds` | Refunds list and refund details |

### Environments

The `url` prop is the base URL of the Control Center that serves the components. The embedded token must be issued by the same environment.

| Environment | `url` | Token API base URL |
|-------------|-------|--------------------|
| Sandbox | `https://app.hyperswitch.io` | `https://app.hyperswitch.io/api` |
| Production | `https://live.hyperswitch.io` | `https://live.hyperswitch.io/api` |

### Customizing the appearance

Pass a theme configuration as `initConfig` to match the components to your brand.

```jsx
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

All fields in `initConfig` are optional. Omitted fields use the default Control Center theme. See [`MerchantTheme`](#merchanttheme-for-initconfig) for the complete list.

### Modals

Modals opened inside a component are displayed over the full host page. While a modal is open, the SDK stretches the component's iframe across the window and locks page scrolling, and restores both when the modal closes.

To keep modals inside the component, set `fullPageModals` to `false`:

```jsx
<Payments url="https://app.hyperswitch.io" fullPageModals={false} />
```

Full-page modals rely on `position: fixed`. If an ancestor of the component has a CSS `transform`, `filter`, `perspective` or `contain`, or creates a stacking context below other page content, the modal can be clipped or covered. Set `fullPageModals` to `false` in that layout.

### Server-side rendering

The components render their content in the browser only. In frameworks with server components, such as the Next.js App Router, use them inside a Client Component.

### Content Security Policy

If you have deployed a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), include the Control Center origin in your `frame-src` directive.

## API reference

### Exports

| Export | Description |
|--------|-------------|
| `HyperswitchProvider` | Provider component that supplies the Hyperswitch instance to the tree |
| `ConnectorConfiguration` | Component that renders the connector configuration UI |
| `Payments` | Component that renders the payments list and payment details |
| `Refunds` | Component that renders the refunds list and refund details |
| `useHyperswitchInstance` | Hook that returns the Hyperswitch instance from the nearest provider |

### `HyperswitchProvider` props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `hyperswitchInstance` | `Hyperswitch` | Yes | Instance returned by `loadHyperswitch()` |

### `ConnectorConfiguration`, `Payments` and `Refunds` props

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | Base URL of the Control Center that serves the component |
| `width?` | `string` | Width of the component container. Defaults to `100%` |
| `height?` | `string` | Initial height of the component container. The component resizes to fit its content |
| `className?` | `string` | Additional class names for the component container |
| `style?` | `Partial<CSSStyleDeclaration>` | Inline styles for the component container |
| `fullPageModals?` | `boolean` | Display modals over the full host page. Defaults to `true` |
| `onResize?` | `(dimensions: { width: number; height: number }) => void` | Called when the component is resized |

### `loadHyperswitch(options)`

Imported from the core package. Returns a `Hyperswitch` instance.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fetchToken` | `() => Promise<string \| undefined>` | Yes | Async function that fetches the embedded token from your server |
| `initConfig` | `MerchantTheme` | No | Theme customization object |

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

## TypeScript support

This package includes TypeScript declarations. Types such as `MerchantTheme` and `ElementOptions` are exported from the core package.

## License

MIT
