(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HyperswitchReact = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
  var React__namespace = /*#__PURE__*/_interopNamespace(React);

  /**
   * React context for Hyperswitch SDK
   */
  // Create context
  var HyperswitchContext = React.createContext(null);
  /**
   * Provider component to make Hyperswitch instance available throughout React component tree
   */
  function HyperswitchProvider(_a) {
      var hyperswitchInstance = _a.hyperswitchInstance, children = _a.children;
      return (React__default["default"].createElement(HyperswitchContext.Provider, { value: hyperswitchInstance }, children));
  }
  /**
   * Hook to access the Hyperswitch instance
   */
  function useHyperswitchInstance() {
      var context = React.useContext(HyperswitchContext);
      if (!context) {
          throw new Error('useHyperswitchInstance must be used within a HyperswitchProvider');
      }
      return context;
  }

  var ConnectorConfiguration = function (props) {
      var hyperswitchInstance = useHyperswitchInstance();
      var containerRef = React.useRef(null);
      React.useEffect(function () {
          if (!containerRef.current)
              return;
          var component = hyperswitchInstance.create('connectors', props);
          component.mount(containerRef.current);
          return function () {
              component.destroy();
          };
      }, [hyperswitchInstance, props]);
      return React__namespace.createElement("div", { ref: containerRef });
  };
  ConnectorConfiguration.displayName = 'ConnectorConfiguration';

  exports.ConnectorConfiguration = ConnectorConfiguration;
  exports.HyperswitchProvider = HyperswitchProvider;
  exports.useHyperswitchInstance = useHyperswitchInstance;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
