# Hyperswitch Embeddable SDK

A JavaScript library for embedding Hyperswitch components via iframes, inspired by Stripe's approach.

## Installation

```bash
npm install hyperswitch-embeddable
# or
yarn add hyperswitch-embeddable
```

## Basic Usage (JavaScript)

```javascript
import { loadHyperswitch } from 'hyperswitch-embeddable';

// Initialize the SDK
(async function() {
  try {
    // Create and authenticate a Hyperswitch instance
    const hyperswitch = await loadHyperswitch('your_api_key', {
      baseUrl: 'http://localhost:5000',
      theme: 'light'
    });
    
    // Create a connector list component
    const connectorList = hyperswitch.create('connector', {
      // Options for the connector
      width: '100%',
      height: '500px'
    });
    
    // Mount it to a DOM element
    connectorList.mount('#connector-container');
    
    // You can add event listeners
    connectorList.on('connectorSelected', (data) => {
      console.log('Connector selected:', data);
    });
    
    // Create and mount other components
    const configComponent = hyperswitch.create('connector-configure');
    configComponent.mount('#config-container');
    
    const dashboard = hyperswitch.create('dashboard');
    dashboard.mount('#dashboard-container');
  } catch (error) {
    console.error('Failed to initialize Hyperswitch:', error);
  }
})();
```

## React Integration

```jsx
import React, { useState, useEffect } from 'react';
import { 
  loadHyperswitch, 
  HyperswitchProvider, 
  ConnectorListReact, 
  ConnectorConfiguration,
  Dashboard
} from 'hyperswitch-embeddable';

function App() {
  const [hyperswitchInstance, setHyperswitchInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize the SDK
  useEffect(() => {
    async function initHyperswitch() {
      try {
        const instance = await loadHyperswitch('your_api_key', {
          baseUrl: 'http://localhost:5000',
          theme: 'dark'
        });
        setHyperswitchInstance(instance);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    
    initHyperswitch();
  }, []);
  
  if (loading) return <div>Loading Hyperswitch SDK...</div>;
  if (error) return <div>Error loading Hyperswitch: {error.message}</div>;
  
  return (
    <HyperswitchProvider hyperswitchInstance={hyperswitchInstance}>
      <div className="app">
        <h1>Hyperswitch Components</h1>
        
        <div className="section">
          <h2>Connector List</h2>
          <ConnectorListReact
            className="connector-list"
            width="100%"
            height="400px"
            // Event handlers passed as props
            onMessage={(message) => console.log('Message:', message)}
            onResize={(dimensions) => console.log('Resized:', dimensions)}
          />
        </div>
        
        <div className="section">
          <h2>Connector Configuration</h2>
          <ConnectorConfiguration
            className="connector-config"
          />
        </div>
        
        <div className="section">
          <h2>Dashboard</h2>
          <Dashboard
            className="dashboard-component"
          />
        </div>
      </div>
    </HyperswitchProvider>
  );
}
```

## Available Components

### 1. Connector List (`connector`)

Displays a list of payment connectors.

```javascript
// JavaScript
const connectorList = hyperswitch.create('connector', options);
connectorList.mount('#container');

// React
<ConnectorListReact {...options} />
```

### 2. Connector Configuration (`connector-configure`)

Allows configuration of payment connectors.

```javascript
// JavaScript
const configComponent = hyperswitch.create('connector-configure', options);
configComponent.mount('#container');

// React
<ConnectorConfiguration {...options} />
```

### 3. Dashboard (`dashboard`)

Displays the Hyperswitch dashboard.

```javascript
// JavaScript
const dashboard = hyperswitch.create('dashboard', options);
dashboard.mount('#container');

// React
<Dashboard {...options} />
```

## Component Options

All components accept the following options:

- `url` - Custom URL for the iframe (defaults to baseUrl + component type)
- `width` - Width of the component (string or number, default: '100%')
- `height` - Height of the component (string or number, default: '500px')
- `style` - Additional CSS styles to apply
- `className` - CSS class name to apply
- `onMessage` - Callback for receiving messages from the component
- `onResize` - Callback for handling resize events

## Initialize Options

When calling `loadHyperswitch`, you can provide these options:

- `baseUrl` - Base URL for the API endpoints
- `token` - Authentication token (if different from apiKey)
- `theme` - UI theme ('light' or 'dark')

## Browser Support

The SDK supports all modern browsers: Chrome, Firefox, Safari, and Edge.

## License

[MIT](LICENSE)
