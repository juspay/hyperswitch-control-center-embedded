# Hyperswitch Control Center Embedded SDK

[![core npm version](https://img.shields.io/npm/v/@juspay-tech/hyperswitch-control-center-embed-core.svg?label=embed-core)](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-core)
[![react npm version](https://img.shields.io/npm/v/@juspay-tech/hyperswitch-control-center-embed-react.svg?label=embed-react)](https://www.npmjs.com/package/@juspay-tech/hyperswitch-control-center-embed-react)

Hyperswitch Control Center embedded components let you add Control Center functionality, such as connector configuration, payments and refunds, to your own website. Your users manage their payment operations without leaving your product.

This repository contains the two packages that make up the SDK.

## Packages

| Package | Description |
|---------|-------------|
| [`@juspay-tech/hyperswitch-control-center-embed-core`](./core/README.md) | Framework-agnostic JavaScript SDK. Contains the initialization logic and TypeScript types |
| [`@juspay-tech/hyperswitch-control-center-embed-react`](./react/README.md) | React components built on top of the core SDK, for React 18 and later |

Each package has its own README with usage details and a complete API reference.

## Supported components

| Component | Core name | React component |
|-----------|-----------|-----------------|
| Connector configuration | `connectors` | `ConnectorConfiguration` |
| Payments list and payment details | `payments` | `Payments` |
| Refunds list and refund details | `refunds` | `Refunds` |

## Documentation

- [Integration Guide](https://docs.hyperswitch.io/explore-hyperswitch/account-management/beta-embeddable-components/integration-guide)
- [Core SDK reference](./core/README.md#api-reference)
- [React SDK reference](./react/README.md#api-reference)

## Installation

```sh
# Core SDK
npm install @juspay-tech/hyperswitch-control-center-embed-core

# React SDK (installs the core SDK as a dependency)
npm install @juspay-tech/hyperswitch-control-center-embed-react
```

## Usage

Embedded components authenticate with a short-lived embedded token. Your server requests the token from Hyperswitch with your API key, and the SDK retrieves it from your server through a `fetchToken` function that you provide. Your API key is never exposed to the browser.

### Issue an embedded token on your server

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

### Core SDK

```js
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';

const fetchToken = async () => {
  // Fetch the embedded token by making an API call to your server
  const response = await fetch('/api/get-embedded-token');
  const { token } = await response.json();
  return token;
};

const hyperswitch = loadHyperswitch({ fetchToken });

const payments = hyperswitch.create('payments', {
  url: 'https://app.hyperswitch.io',
});

payments.mount('#hyperswitch-root');
```

### React SDK

```jsx
import { loadHyperswitch } from '@juspay-tech/hyperswitch-control-center-embed-core';
import {
  HyperswitchProvider,
  Payments,
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
  </HyperswitchProvider>
);
```

### Environments

The `url` option is the base URL of the Control Center that serves the components. The embedded token must be issued by the same environment.

| Environment | `url` | Token API base URL |
|-------------|-------|--------------------|
| Sandbox | `https://app.hyperswitch.io` | `https://app.hyperswitch.io/api` |
| Production | `https://live.hyperswitch.io` | `https://live.hyperswitch.io/api` |

Appearance customization, modal behavior and the full list of options are covered in the [core](./core/README.md) and [react](./react/README.md) READMEs.

## Development

This repository uses `pnpm` workspaces.

```sh
pnpm install          # Install dependencies
pnpm run build        # Build all packages
pnpm run type-check   # Type check all packages
pnpm run build:core   # Build the core package only
pnpm run build:react  # Build the react package only
pnpm run clean        # Remove build artifacts
```

## Contributing

If you would like to contribute, please read the [contributor guidelines](./CONTRIBUTING.md). Commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, which the release process uses to determine versions and generate the changelog.

## License

MIT
