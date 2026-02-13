import * as React from 'react';
import React__default, { createContext, useContext, useRef, useEffect } from 'react';

/**
 * React context for Hyperswitch SDK
 */
// Create context
var HyperswitchContext = createContext(null);
/**
 * Provider component to make Hyperswitch instance available throughout React component tree
 */
function HyperswitchProvider(_a) {
    var hyperswitchInstance = _a.hyperswitchInstance, children = _a.children;
    return (React__default.createElement(HyperswitchContext.Provider, { value: hyperswitchInstance }, children));
}
/**
 * Hook to access the Hyperswitch instance
 */
function useHyperswitchInstance() {
    var context = useContext(HyperswitchContext);
    if (!context) {
        throw new Error('useHyperswitchInstance must be used within a HyperswitchProvider');
    }
    return context;
}

var ConnectorConfiguration = function (props) {
    var hyperswitchInstance = useHyperswitchInstance();
    var containerRef = useRef(null);
    useEffect(function () {
        if (!containerRef.current)
            return;
        var component = hyperswitchInstance.create('connectors', props);
        component.mount(containerRef.current);
        return function () {
            component.destroy();
        };
    }, [hyperswitchInstance, props]);
    return React.createElement("div", { ref: containerRef });
};
ConnectorConfiguration.displayName = 'ConnectorConfiguration';

export { ConnectorConfiguration, HyperswitchProvider, useHyperswitchInstance };
//# sourceMappingURL=index.esm.js.map
