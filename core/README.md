# @juspay-tech/hyperswitch-control-center-embed-core

JavaScript SDK for embedding Hyperswitch Control Center components into any web application.

Using React? See [`@juspay-tech/hyperswitch-control-center-embed-react`](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-react).

## Integration

### 1. Create a token endpoint on your backend

Your backend exchanges your Hyperswitch API key for an embedded token. Keep the API key on your server; only the token goes to the browser.

```javascript
// Node.js / Express
app.get('/api/get-embedded-token', async (req, res) => {
  const response = await fetch(`${process.env.HYPERSWITCH_API_URL}/embedded/token`, {
    headers: {
      'api-key': process.env.HYPERSWITCH_API_KEY,
      'x-profile-id': process.env.HYPERSWITCH_PROFILE_ID
    }
  });
  const data = await response.json();
  res.json({ token: data.token });
});
```

### 2. Install the SDK

```bash
npm install @juspay-tech/hyperswitch-control-center-embed-core
```

### 3. Initialize with `fetchToken`

```javascript
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';

const hyperswitch = loadHyperswitch({
  fetchToken: async () => {
    const response = await fetch('/api/get-embedded-token');
    const data = await response.json();
    return data.token;
  }
});
```

The SDK calls `fetchToken` on load and again whenever the token expires.

### 4. Create and mount a component

```html
<div id="hyperswitch-root"></div>
```

```javascript
const payments = hyperswitch.create('payments', {
  url: 'https://app.hyperswitch.io'
});

payments.mount('#hyperswitch-root');
```

Call `payments.destroy()` to remove it.

### Environments

| Environment | `url` | `HYPERSWITCH_API_URL` |
|-------------|-------|-----------------------|
| Sandbox | `https://app.hyperswitch.io` | `https://app.hyperswitch.io/api` |
| Production | `https://live.hyperswitch.io` | `https://live.hyperswitch.io/api` |

Use the same environment for the token and the component.

## Components

| Name | Renders |
|------|---------|
| `connectors` | Connector configuration |
| `payments` | Payments list and payment details |
| `refunds` | Refunds list and refund details |

## Options

Options passed to `hyperswitch.create(name, options)`:

| Option | Type | Description |
|--------|------|-------------|
| `url` | `string` | Base URL of the Control Center. Required |
| `width` | `string` | Width of the component. Defaults to `100%` |
| `height` | `string` | Initial height. The component resizes to fit its content |
| `className` | `string` | Extra class names for the container |
| `style` | `object` | Inline styles for the container |
| `fullPageModals` | `boolean` | Show modals over the full host page. Defaults to `true` |
| `onResize` | `({ width, height }) => void` | Called when the component changes height |

Each component has `mount(selectorOrElement)` and `destroy()`.

### Modals

Modals opened inside a component are shown over the full host page. To keep them inside the component, pass `fullPageModals: false`. Do this if an ancestor of the mount point uses a CSS `transform` or `filter`, which can clip the modal.

## Theming

Pass an optional `initConfig` to match the components to your brand. All fields are optional.

```javascript
const hyperswitch = loadHyperswitch({
  fetchToken: async () => { /* ... */ },
  initConfig: {
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
  }
});
```

## Documentation

For the full setup, see the [Integration Guide](https://docs.hyperswitch.io/explore-hyperswitch/account-management/beta-embeddable-components/integration-guide).

## License

MIT
