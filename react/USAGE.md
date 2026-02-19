# How to Use @juspay-tech/hyper-dashboard-embed-react in Your Application

This guide shows you how to integrate the React SDK into your application.

## Installation

```bash
npm install @juspay-tech/hyper-dashboard-embed-react @juspay-tech/hyper-dashboard-embed-core
# or
pnpm add @juspay-tech/hyper-dashboard-embed-react @juspay-tech/hyper-dashboard-embed-core
# or
yarn add @juspay-tech/hyper-dashboard-embed-react @juspay-tech/hyper-dashboard-embed-core
```

**Note:** This package requires React 18+ as a peer dependency.

## Basic Setup

### 1. Initialize the SDK

First, create an SDK instance using `loadHyperswitch` from the core package. You'll need to provide a `fetchToken` function that returns a promise resolving to your authentication token.

```tsx
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';
import { HyperswitchProvider, ConnectorConfiguration } from '@juspay-tech/hyper-dashboard-embed-react';

// Create your token fetching function
async function fetchToken() {
  // Replace this with your actual token fetching logic
  const response = await fetch('/api/get-token');
  const data = await response.json();
  return data.token;
}

// Initialize the SDK instance
const hyperswitchInstance = loadHyperswitch({
  fetchToken,
  // Optional: Add theme configuration
  initConfig: {
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    buttons: {
      primary: {
        backgroundColor: '#007bff',
        textColor: '#ffffff',
        hoverBackgroundColor: '#0056b3'
      }
    }
  }
});
```

### 2. Wrap Your App with HyperswitchProvider

Wrap your application (or the part that needs SDK access) with the `HyperswitchProvider`:

```tsx
import React from 'react';
import { HyperswitchProvider } from '@juspay-tech/hyper-dashboard-embed-react';
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';

function App() {
  // Initialize SDK (do this once, outside component if possible)
  const hyperswitchInstance = React.useMemo(() => {
    return loadHyperswitch({
      fetchToken: async () => {
        const response = await fetch('/api/get-token');
        const data = await response.json();
        return data.token;
      },
      initConfig: {
        primaryColor: '#007bff',
        backgroundColor: '#ffffff'
      }
    });
  }, []);

  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitchInstance}>
      <YourAppContent />
    </HyperswitchProvider>
  );
}
```

### 3. Use the ConnectorConfiguration Component

Now you can use the `ConnectorConfiguration` component anywhere within the provider:

```tsx
import { ConnectorConfiguration } from '@juspay-tech/hyper-dashboard-embed-react';

function YourComponent() {
  return (
    <div>
      <h1>Connector Configuration</h1>
      <ConnectorConfiguration
        url="https://your-connector-url.com"
        width="100%"
        height="600px"
        onMessage={(message) => {
          console.log('Message from embedded component:', message);
        }}
        onResize={(dimensions) => {
          console.log('Component resized:', dimensions);
        }}
      />
    </div>
  );
}
```

## Complete Example

Here's a complete working example:

```tsx
import React, { useMemo } from 'react';
import { HyperswitchProvider, ConnectorConfiguration, useHyperswitchInstance } from '@juspay-tech/hyper-dashboard-embed-react';
import { loadHyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';

// Token fetching function
async function fetchAuthToken() {
  try {
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ /* your auth data */ }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

// Main App Component
function App() {
  // Initialize SDK instance (only once)
  const hyperswitchInstance = useMemo(() => {
    return loadHyperswitch({
      fetchToken: fetchAuthToken,
      initConfig: {
        primaryColor: '#007bff',
        backgroundColor: '#f8f9fa',
        buttons: {
          primary: {
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            hoverBackgroundColor: '#0056b3'
          },
          secondary: {
            backgroundColor: '#6c757d',
            textColor: '#ffffff',
            hoverBackgroundColor: '#5a6268'
          }
        }
      }
    });
  }, []);

  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitchInstance}>
      <div className="app">
        <Header />
        <ConnectorPage />
      </div>
    </HyperswitchProvider>
  );
}

// Component using ConnectorConfiguration
function ConnectorPage() {
  const handleMessage = (message: any) => {
    console.log('Received message:', message);
    // Handle messages from the embedded component
  };

  const handleResize = (dimensions: { width: number; height: number }) => {
    console.log('Component resized to:', dimensions);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Connector Configuration</h1>
      <ConnectorConfiguration
        url="https://your-connector-config-url.com"
        width="100%"
        height="700px"
        className="connector-container"
        onMessage={handleMessage}
        onResize={handleResize}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}

// Example: Using the hook to access SDK instance directly
function CustomComponent() {
  const hyperswitch = useHyperswitchInstance();
  
  const handleCustomAction = () => {
    // You can create custom elements programmatically
    const element = hyperswitch.create('connectors', {
      url: 'https://example.com',
      width: '100%',
      height: '500px'
    });
    
    // Mount to a DOM element
    const container = document.getElementById('custom-container');
    if (container) {
      element.mount(container);
    }
  };

  return (
    <div>
      <button onClick={handleCustomAction}>Create Custom Element</button>
      <div id="custom-container"></div>
    </div>
  );
}

export default App;
```

## Component Props

### ConnectorConfiguration

The `ConnectorConfiguration` component accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `url` | `string` | No | Base URL for the embedded component |
| `width` | `string \| number` | No | Width of the element container |
| `height` | `string \| number` | No | Height of the element container |
| `style` | `Partial<CSSStyleDeclaration>` | No | Custom CSS styles to apply |
| `className` | `string` | No | Additional CSS class names |
| `onMessage` | `(message: any) => void` | No | Callback for messages from the embedded iframe |
| `onResize` | `(dimensions: { width: number; height: number }) => void` | No | Callback for resize events |

## Using the Hook

If you need direct access to the SDK instance, use the `useHyperswitchInstance` hook:

```tsx
import { useHyperswitchInstance } from '@juspay-tech/hyper-dashboard-embed-react';

function MyComponent() {
  const hyperswitch = useHyperswitchInstance();
  
  // Now you can use hyperswitch methods directly
  // For example: hyperswitch.create('connectors', options)
  
  return <div>My Component</div>;
}
```

**Important:** `useHyperswitchInstance` must be used within a component that's wrapped by `HyperswitchProvider`, otherwise it will throw an error.

## TypeScript Support

This package includes full TypeScript definitions. All types are exported from `@juspay-tech/hyper-dashboard-embed-core`:

```tsx
import type { 
  HyperswitchInitOptions, 
  ElementOptions, 
  MerchantTheme 
} from '@juspay-tech/hyper-dashboard-embed-core';
```

## Best Practices

1. **Initialize SDK once**: Create the SDK instance outside your component or use `useMemo` to ensure it's only created once.

2. **Token fetching**: Make sure your `fetchToken` function handles errors gracefully and returns a valid token string.

3. **Cleanup**: The `ConnectorConfiguration` component automatically cleans up when unmounted, so you don't need to worry about memory leaks.

4. **Error handling**: Wrap your token fetching in try-catch blocks and handle errors appropriately.

5. **Provider placement**: Place `HyperswitchProvider` as high in your component tree as needed, but not higher than necessary.

## Troubleshooting

### Error: "useHyperswitchInstance must be used within a HyperswitchProvider"

This means you're trying to use the hook outside of the provider. Make sure your component is wrapped by `HyperswitchProvider`.

### Token not being fetched

Check that:
- Your `fetchToken` function is properly defined
- It returns a promise that resolves to a string
- Your API endpoint is accessible and returns the token correctly

### Component not rendering

Ensure:
- The SDK instance is properly initialized
- You're using the component within the `HyperswitchProvider`
- The `url` prop is provided if required by your use case