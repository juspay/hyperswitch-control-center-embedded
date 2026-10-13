# Hyperswitch Control Center Embedded SDK

[![core on npm](https://img.shields.io/npm/v/@juspay-tech/hyperswitch-control-center-embed-core?label=embed-core)](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-core)
[![react on npm](https://img.shields.io/npm/v/@juspay-tech/hyperswitch-control-center-embed-react?label=embed-react)](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-react)

Embed Hyperswitch Control Center screens inside your own product, so your users can manage connectors, payments and refunds without leaving your dashboard.

## Packages

| Package | Use it for |
|---------|------------|
| [`@juspay-tech/hyperswitch-control-center-embed-core`](./core/README.md) | Any web app (framework-agnostic JavaScript) |
| [`@juspay-tech/hyperswitch-control-center-embed-react`](./react/README.md) | React 18+ apps |

## Components

| Component | Core name | React component |
|-----------|-----------|-----------------|
| Connector configuration | `connectors` | `<ConnectorConfiguration />` |
| Payments list and details | `payments` | `<Payments />` |
| Refunds list and details | `refunds` | `<Refunds />` |

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
# JavaScript
npm install @juspay-tech/hyperswitch-control-center-embed-core

# React (includes the core package)
npm install @juspay-tech/hyperswitch-control-center-embed-react
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

### 4. Add a component

**JavaScript**

```javascript
const payments = hyperswitch.create('payments', {
  url: 'https://app.hyperswitch.io'
});

payments.mount('#hyperswitch-root');
```

**React**

```jsx
import {
  HyperswitchProvider,
  Payments
} from '@juspay-tech/hyperswitch-control-center-embed-react';

function App() {
  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitch}>
      <Payments url="https://app.hyperswitch.io" />
    </HyperswitchProvider>
  );
}
```

### Environments

| Environment | `url` | `HYPERSWITCH_API_URL` |
|-------------|-------|-----------------------|
| Sandbox | `https://app.hyperswitch.io` | `https://app.hyperswitch.io/api` |
| Production | `https://live.hyperswitch.io` | `https://live.hyperswitch.io/api` |

Use the same environment for the token and the component.

See the [core](./core/README.md) and [react](./react/README.md) READMEs for options and theming, and the [Integration Guide](https://docs.hyperswitch.io/explore-hyperswitch/account-management/beta-embeddable-components/integration-guide) for the full setup.

## Development

This repository is a `pnpm` workspace.

```bash
pnpm install          # install dependencies
pnpm run build        # build both packages
pnpm run type-check   # type-check both packages
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the commit convention and pull request process.

## License

MIT
