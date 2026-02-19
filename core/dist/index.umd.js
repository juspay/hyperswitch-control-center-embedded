(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Hyperswitch = {}));
})(this, (function (exports) { 'use strict';

  const isBrowser$1 = typeof window !== 'undefined';
  class HyperswitchElement {
      constructor(instance, options) {
          this.instance = instance;
          this.options = options || {};
          this._internalId = `hyper-el-${Math.random().toString(36).substring(7)}`;
          this.boundMessageHandler = null;
          // In SSR / non-browser environments, avoid touching DOM APIs.
          // The React wrapper only creates and mounts elements on the client,
          // so it's safe for server-side usage as long as we no-op here.
          if (!isBrowser$1) {
              return;
          }
          this.element = document.createElement('div');
          this.iframe = document.createElement('iframe');
          this.boundMessageHandler = this.handleMessage.bind(this);
          this.setupElement();
          this.setupIframe();
          window.addEventListener('message', this.boundMessageHandler);
      }
      setupElement() {
          if (!isBrowser$1) {
              return;
          }
          this.element.className = `hyperswitch-element ${this.options.className || ''}`.trim();
          this.element.dataset.hyperswitchElement = this.getElementType();
          Object.assign(this.element.style, Object.assign({ width: this.options.width || '100%', height: this.options.height || '500px', overflow: 'hidden' }, (this.options.style || {})));
      }
      setupIframe() {
          if (!isBrowser$1) {
              return;
          }
          this.iframe.src = this.getIframeSrc();
          this.iframe.style.border = 'none';
          this.iframe.style.width = '100%';
          this.iframe.style.height = '100%';
          this.iframe.title = `Hyperswitch ${this.getElementType()}`;
          this.iframe.setAttribute('allow', 'clipboard-read; clipboard-write; clipboard-sanitized-write');
          this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation allow-downloads');
          this.element.appendChild(this.iframe);
      }
      handleMessage(event) {
          var _a;
          if (!isBrowser$1) {
              return;
          }
          if (this.options.onMessage) {
              this.options.onMessage(event.data);
          }
          if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'EMBEDDED_COMPONENT_RESIZE') {
              const newHeight = event.data.height;
              const messageComponent = event.data.component || '';
              if (messageComponent === this.getElementType() && typeof newHeight === 'number' && newHeight > 0) {
                  this.element.style.height = `${newHeight}px`;
                  if (this.options.onResize) {
                      this.options.onResize({
                          width: this.element.clientWidth,
                          height: newHeight
                      });
                  }
              }
          }
      }
      mount(domNode) {
          if (!isBrowser$1) {
              throw new Error('HyperswitchElement.mount can only be called in a browser environment');
          }
          const parent = typeof domNode === 'string'
              ? document.querySelector(domNode)
              : domNode;
          if (!parent) {
              throw new Error(`Invalid mount point: ${domNode}`);
          }
          parent.appendChild(this.element);
          return this;
      }
      destroy() {
          if (!isBrowser$1) {
              return;
          }
          if (this.boundMessageHandler) {
              window.removeEventListener('message', this.boundMessageHandler);
          }
          if (this.element && this.element.parentNode) {
              this.element.parentNode.removeChild(this.element);
          }
      }
      getIframe() {
          return this.iframe;
      }
  }

  class ConnectorConfigurationComponent extends HyperswitchElement {
      constructor(instance, options) {
          super(instance, options);
      }
      getElementType() {
          return 'connectors';
      }
      getIframeSrc() {
          const baseUrl = this.options.url || 'http://localhost:9000';
          return `${baseUrl}/embedded/connectors`;
      }
  }

  /**
   * Build the init_config object that Control Center expects
   * from the simple MerchantTheme contract.
   *
   * Any missing value is set to null.
   */
  function buildInitConfig(merchantTheme) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
      const safeTheme = merchantTheme || {};
      return {
          settings: {
              colors: {
                  primary: (_a = safeTheme.primaryColor) !== null && _a !== void 0 ? _a : null,
                  secondary: null,
                  background: (_b = safeTheme.backgroundColor) !== null && _b !== void 0 ? _b : null
              },
              sidebar: null,
              typography: null,
              buttons: {
                  primary: {
                      backgroundColor: (_e = (_d = (_c = safeTheme.buttons) === null || _c === void 0 ? void 0 : _c.primary) === null || _d === void 0 ? void 0 : _d.backgroundColor) !== null && _e !== void 0 ? _e : null,
                      textColor: (_h = (_g = (_f = safeTheme.buttons) === null || _f === void 0 ? void 0 : _f.primary) === null || _g === void 0 ? void 0 : _g.textColor) !== null && _h !== void 0 ? _h : null,
                      hoverBackgroundColor: (_l = (_k = (_j = safeTheme.buttons) === null || _j === void 0 ? void 0 : _j.primary) === null || _k === void 0 ? void 0 : _k.hoverBackgroundColor) !== null && _l !== void 0 ? _l : null
                  },
                  secondary: {
                      backgroundColor: (_p = (_o = (_m = safeTheme.buttons) === null || _m === void 0 ? void 0 : _m.secondary) === null || _o === void 0 ? void 0 : _o.backgroundColor) !== null && _p !== void 0 ? _p : null,
                      textColor: (_s = (_r = (_q = safeTheme.buttons) === null || _q === void 0 ? void 0 : _q.secondary) === null || _r === void 0 ? void 0 : _r.textColor) !== null && _s !== void 0 ? _s : null,
                      hoverBackgroundColor: (_v = (_u = (_t = safeTheme.buttons) === null || _t === void 0 ? void 0 : _t.secondary) === null || _u === void 0 ? void 0 : _u.hoverBackgroundColor) !== null && _v !== void 0 ? _v : null
                  }
              },
              borders: null,
              spacing: null
          },
          urls: {
              faviconUrl: null,
              logoUrl: null
          }
      };
  }

  const isBrowser = typeof window !== 'undefined';
  class Hyperswitch {
      constructor(options) {
          this.token = null;
          this.initConfig = null;
          this.activeElements = new Map();
          this.isRefetchingToken = false;
          this.tokenError = null;
          if (!options || typeof options.fetchToken !== 'function') {
              throw new Error('loadHyperswitch requires a fetchToken callback function');
          }
          this.fetchToken = options.fetchToken;
          this.initConfig = options.initConfig ? buildInitConfig(options.initConfig) : null;
          this.initPromise = this.fetchInitialToken();
          this.listenForMessages();
      }
      fetchInitialToken() {
          const eagerTokenPromise = (() => {
              try {
                  return this.fetchToken();
              }
              catch (error) {
                  return Promise.reject(error);
              }
          })();
          return eagerTokenPromise.then((token) => {
              if (token) {
                  this.token = token;
              }
              else {
                  this.tokenError = 'Failed to fetch token: Token returned empty or undefined';
              }
          }).catch((error) => {
              this.tokenError = `Failed to fetch token: ${error instanceof Error ? error.message : String(error)}`;
          });
      }
      listenForMessages() {
          if (!isBrowser) {
              // In SSR / non-browser environments we can't listen for postMessage events,
              // but it's still safe to create a Hyperswitch instance (it will become
              // useful on the client where another instance will typically be created).
              return;
          }
          window.addEventListener("message", async (event) => {
              var _a, _b, _c;
              if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === "TOKEN_EXPIRED" && ((_b = event.data) === null || _b === void 0 ? void 0 : _b.value) === true) {
                  await this.refetchAndBroadcastToken();
              }
              else if (((_c = event.data) === null || _c === void 0 ? void 0 : _c.type) === "EMBEDDED_IFRAME_READY") {
                  // Find the element whose iframe matches the event source
                  this.activeElements.forEach((element) => {
                      const iframe = element.getIframe();
                      if ((iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === event.source) {
                          this.onElementIframeLoaded(element);
                      }
                  });
              }
          });
      }
      async refetchAndBroadcastToken() {
          if (this.isRefetchingToken) {
              return;
          }
          this.isRefetchingToken = true;
          try {
              const newToken = await this.fetchToken();
              if (newToken) {
                  this.token = newToken;
                  this.tokenError = null;
                  this.activeElements.forEach((element, elementId) => {
                      const iframe = element.getIframe();
                      if (iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) {
                          iframe.contentWindow.postMessage({
                              type: 'AUTH_TOKEN',
                              token: this.token
                          }, '*');
                      }
                  });
              }
              else {
                  this.tokenError = 'Failed to refetch token: Token returned empty or undefined';
                  this.sendErrorToActiveElements(this.tokenError);
              }
          }
          catch (error) {
              this.tokenError = `Failed to refetch token: ${error instanceof Error ? error.message : String(error)}`;
              this.sendErrorToActiveElements(this.tokenError);
          }
          finally {
              this.isRefetchingToken = false;
          }
      }
      sendErrorToActiveElements(errorMessage) {
          this.activeElements.forEach((element) => {
              const iframe = element.getIframe();
              if (iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) {
                  iframe.contentWindow.postMessage({
                      type: 'AUTH_ERROR',
                      error: errorMessage
                  }, '*');
              }
          });
      }
      create(type, options) {
          let element;
          switch (type) {
              case 'connectors':
                  element = new ConnectorConfigurationComponent(this, options);
                  break;
              default:
                  throw new Error(`Unknown element type: ${type}`);
          }
          this.activeElements.set(element._internalId, element);
          return element;
      }
      onElementIframeLoaded(element) {
          this.initPromise.then(() => {
              const iframe = element.getIframe();
              if (!(iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow)) {
                  return;
              }
              setTimeout(() => {
                  try {
                      const contentWindow = iframe.contentWindow;
                      if (!contentWindow) {
                          return;
                      }
                      if (this.tokenError) {
                          contentWindow.postMessage({
                              type: 'AUTH_ERROR',
                              error: this.tokenError
                          }, '*');
                      }
                      else if (this.token) {
                          contentWindow.postMessage({
                              type: 'AUTH_TOKEN',
                              token: this.token
                          }, '*');
                      }
                      else {
                          contentWindow.postMessage({
                              type: 'AUTH_ERROR',
                              error: 'No token available'
                          }, '*');
                      }
                      // Send init_config (if available) as a separate message
                      if (this.initConfig) {
                          contentWindow.postMessage({
                              type: 'INIT_CONFIG',
                              init_config: this.initConfig
                          }, '*');
                      }
                  }
                  catch (error) {
                  }
              }, 100);
          }).catch((error) => {
              const iframe = element.getIframe();
              const contentWindow = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow;
              if (contentWindow) {
                  setTimeout(() => {
                      try {
                          contentWindow.postMessage({
                              type: 'AUTH_ERROR',
                              error: `Token initialization failed: ${error instanceof Error ? error.message : String(error)}`
                          }, '*');
                      }
                      catch (_a) {
                      }
                  }, 100);
              }
          });
      }
  }
  function loadHyperswitch(options) {
      return new Hyperswitch(options);
  }

  const VERSION = '1.0.0';

  exports.ConnectorConfigurationComponent = ConnectorConfigurationComponent;
  exports.Hyperswitch = Hyperswitch;
  exports.HyperswitchElement = HyperswitchElement;
  exports.VERSION = VERSION;
  exports.loadHyperswitch = loadHyperswitch;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
