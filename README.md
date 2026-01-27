# Hyperswitch Embeddable SDK

A React SDK for embedding Hyperswitch connector configuration into your application with built-in authentication and token management.

## Features

- Automatic token management with expiration handling
- Secure communication between your app and embedded components
- Simple React integration with Provider pattern

## Installation

Add the following to your `package.json` dependencies:

```json
"dependencies": {
  "hyperswitch-control-center-embedded": "github:juspay/hyperswitch-control-center-embedded"
}
```

Then run:
```bash
npm install
```

**Requirements:**
- React 18.x - 20.x

## Quick Start

```jsx
import React, { useEffect, useState } from 'react';
import { loadHyperswitch, HyperswitchProvider, ConnectorConfiguration } from 'hyperswitch-control-center-embedded';

function App() {
  const [hyperswitchInstance, setHyperswitchInstance] = useState(null);

  useEffect(() => {
    const instance = loadHyperswitch({
      fetchToken: async () => {
        // Fetch your authentication token from your backend
        const response = await fetch('/api/get-token');
        const data = await response.json();
        return data.token;
      }
    });
    setHyperswitchInstance(instance);
  }, []);

  if (!hyperswitchInstance) {
    return <div>Loading...</div>;
  }

  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitchInstance}>
      <ConnectorConfiguration />
    </HyperswitchProvider>
  );
}

export default App;
```

## How It Works

### 1. Initialize the SDK

Create a Hyperswitch instance by providing a function that fetches your authentication token:

```javascript
import { loadHyperswitch } from 'hyperswitch-embeddable';

const hyperswitchInstance = loadHyperswitch({
  fetchToken: async () => {
    // Your logic to fetch authentication token
    const token = await yourAuthService.getToken();
    return token;
  }
});
```

The `fetchToken` function will be called:
- When the SDK is initialized
- Automatically when the token expires

### 2. Add the Provider

Wrap your app with `HyperswitchProvider`:

```jsx
import { HyperswitchProvider } from 'hyperswitch-embeddable';

<HyperswitchProvider hyperswitchInstance={hyperswitchInstance}>
  {/* Your app components */}
</HyperswitchProvider>
```

### 3. Use the Component

Add `ConnectorConfiguration` anywhere inside the provider:

```jsx
import { ConnectorConfiguration } from 'hyperswitch-embeddable';

<ConnectorConfiguration />
```

## API Reference

### `loadHyperswitch(options)`

Initializes the SDK.

**Parameters:**
- `fetchToken` (required): `() => Promise<string | undefined>` - Function that returns your authentication token

**Returns:** Hyperswitch instance

### `<HyperswitchProvider>`

Provider component that makes the Hyperswitch instance available to child components.

**Props:**
- `hyperswitchInstance` (required): The instance from `loadHyperswitch()`
- `children` (required): Your React components

### `<ConnectorConfiguration>`

Component that renders the connector configuration interface.

**Props:**
- `url` (optional): Custom base URL (default: `http://localhost:9000`)

**Example:**
```jsx
<ConnectorConfiguration url="https://your-hyperswitch-instance.com" />
```

## Token Management

The SDK handles token lifecycle automatically:

1. **Initial Load**: Fetches token when SDK initializes
2. **Token Expiration**: When the embedded component detects token expiration, it signals the SDK
3. **Auto Refresh**: SDK calls your `fetchToken()` function to get a new token
4. **Distribution**: New token is automatically sent to all embedded components


## Error Handling

Handle errors in your `fetchToken` function:

```jsx
const hyperswitchInstance = loadHyperswitch({
  fetchToken: async () => {
    try {
      const token = await getTokenFromBackend();
      return token;
    } catch (error) {
      console.error('Token fetch error:', error);
      return undefined; // SDK will send AUTH_ERROR to iframe
    }
  }
});
```

## Support

For issues and questions, visit the [GitHub repository](https://github.com/juspay/hyperswitch-control-center-embedded).