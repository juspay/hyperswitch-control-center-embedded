# How to Use openSidebar in Your Application

## Implementation Complete

The `ConnectorConfiguration` component now exposes an `openSidebar()` method that you can call from your application.

## Usage in Your Application

### Step 1: Import the Component

```jsx
import { ConnectorConfiguration } from "./react/components";
import { useRef } from "react";
```

### Step 2: Create a Ref

```jsx
function YourApp() {
  const connectorRef = useRef();

  // ...
}
```

### Step 3: Attach the Ref to the Component

```jsx
<ConnectorConfiguration ref={connectorRef} />
```

### Step 4: Call openSidebar When Needed

```jsx
<button onClick={() => connectorRef.current.openSidebar()}>Open Sidebar</button>
```

## Complete Example

```jsx
import React, { useRef } from "react";
import { ConnectorConfiguration } from "./react/components";

function YourApp() {
  const connectorRef = useRef();

  const handleOpenSidebar = () => {
    if (connectorRef.current) {
      connectorRef.current.openSidebar();
    }
  };

  return (
    <div>
      {/* Your existing connector component */}
      <ConnectorConfiguration ref={connectorRef} />

      {/* Button or any other trigger to open sidebar */}
      <button onClick={handleOpenSidebar}>Open Sidebar Modal</button>
    </div>
  );
}

export default YourApp;
```

## What Happens When You Call openSidebar()

1. The `openSidebar()` method sends a message with type `OPEN_SIDEBAR_MODAL`
2. Your parent component (where you render `ConnectorConfiguration`) should listen for this message and render the modal
3. The modal can be rendered however you want in your parent component

## Next Steps
