# Hyperswitch Embeddable SDK

A simple React library for embedding Hyperswitch components via iframes.

## Installation

```bash
npm install hyperswitch-embeddable
```

## Components

This SDK provides two main components:

### HyperswitchHome

```jsx
import React from "react";
import { HyperswitchHome } from "hyperswitch-embeddable";

function App() {
  return (
    <div>
      <HyperswitchHome />
    </div>
  );
}
```

The `HyperswitchHome` component renders an iframe that loads the Hyperswitch home page. By default, it points to `http://localhost:5000/v2/home`.

### ConnectorList

```jsx
import React from "react";
import { ConnectorList } from "hyperswitch-embeddable";

function App() {
  return (
    <div>
      <ConnectorList />
    </div>
  );
}
```

The `ConnectorList` component renders an iframe that loads the Hyperswitch connector list. By default, it points to `http://localhost:5000/connector`.

## Props

Both components accept the following props:

- `url`: (optional) Override the default URL
- `width`: (optional) Set the iframe width (default: '100%')
- `height`: (optional) Set the iframe height (default: '500px')
- `style`: (optional) Add custom CSS styles to the iframe

Example with custom props:

```jsx
<HyperswitchHome width="800px" height="600px" style={{ borderRadius: "8px" }} />
```

## Messaging

The ConnectorList component sends a message to the iframe content (child window) when it mounts. This allows the parent application to communicate with the content loaded in the iframe.

### Parent-to-Child Communication

The ConnectorList component automatically sends a message to the iframe content with a token. This message can be received inside the iframe content with the following code:

```js
// Inside the iframe content (e.g., a script in http://localhost:5000/connector)
window.addEventListener("message", (event) => {
  // Verify the message source if needed
  // if (event.origin !== 'your-expected-origin') return;

  // Process the message
  if (event.data && event.data.type === "PARENT_MESSAGE") {
    console.log("Token received in iframe:", event.data.token); // Will output: 'sfvgsdfvfgdB'

    // You can now use this token in your iframe content
    // For example, authenticate with a backend service
  }
});
```

This approach allows secure communication between your main application and the content loaded inside the iframe, even if they are from different domains (subject to cross-origin restrictions).
