(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HyperswitchEmbeddable = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined';
    var HyperswitchElement = /** @class */ (function () {
        function HyperswitchElement(instance, options) {
            this.instance = instance;
            this.options = options || {};
            this._internalId = "hyper-el-".concat(Math.random().toString(36).substring(7));
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
        HyperswitchElement.prototype.setupElement = function () {
            if (!isBrowser$1) {
                return;
            }
            this.element.className = "hyperswitch-element ".concat(this.options.className || '').trim();
            this.element.dataset.hyperswitchElement = this.getElementType();
            Object.assign(this.element.style, __assign({ width: this.options.width || '100%', height: this.options.height || '500px', overflow: 'hidden' }, (this.options.style || {})));
        };
        HyperswitchElement.prototype.setupIframe = function () {
            if (!isBrowser$1) {
                return;
            }
            this.iframe.src = this.getIframeSrc();
            this.iframe.style.border = 'none';
            this.iframe.style.width = '100%';
            this.iframe.style.height = '100%';
            this.iframe.title = "Hyperswitch ".concat(this.getElementType());
            this.iframe.setAttribute('allow', 'clipboard-read; clipboard-write; clipboard-sanitized-write');
            this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation allow-downloads');
            this.element.appendChild(this.iframe);
        };
        HyperswitchElement.prototype.handleMessage = function (event) {
            var _a;
            if (!isBrowser$1) {
                return;
            }
            if (this.options.onMessage) {
                this.options.onMessage(event.data);
            }
            if (((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === 'EMBEDDED_COMPONENT_RESIZE') {
                var newHeight = event.data.height;
                var messageComponent = event.data.component || '';
                if (messageComponent === this.getElementType() && typeof newHeight === 'number' && newHeight > 0) {
                    this.element.style.height = "".concat(newHeight, "px");
                    if (this.options.onResize) {
                        this.options.onResize({
                            width: this.element.clientWidth,
                            height: newHeight
                        });
                    }
                }
            }
        };
        HyperswitchElement.prototype.mount = function (domNode) {
            if (!isBrowser$1) {
                throw new Error('HyperswitchElement.mount can only be called in a browser environment');
            }
            var parent = typeof domNode === 'string'
                ? document.querySelector(domNode)
                : domNode;
            if (!parent) {
                throw new Error("Invalid mount point: ".concat(domNode));
            }
            parent.appendChild(this.element);
            return this;
        };
        HyperswitchElement.prototype.destroy = function () {
            if (!isBrowser$1) {
                return;
            }
            if (this.boundMessageHandler) {
                window.removeEventListener('message', this.boundMessageHandler);
            }
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        };
        HyperswitchElement.prototype.getIframe = function () {
            return this.iframe;
        };
        return HyperswitchElement;
    }());

    var ConnectorConfigurationComponent = /** @class */ (function (_super) {
        __extends(ConnectorConfigurationComponent, _super);
        function ConnectorConfigurationComponent(instance, options) {
            return _super.call(this, instance, options) || this;
        }
        ConnectorConfigurationComponent.prototype.getElementType = function () {
            return 'connectors';
        };
        ConnectorConfigurationComponent.prototype.getIframeSrc = function () {
            var baseUrl = this.options.url || 'http://localhost:9000';
            return "".concat(baseUrl, "/embedded/connectors");
        };
        return ConnectorConfigurationComponent;
    }(HyperswitchElement));

    /**
     * Build the init_config object that Control Center expects
     * from the simple MerchantTheme contract.
     *
     * Any missing value is set to null.
     */
    function buildInitConfig(merchantTheme) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var safeTheme = merchantTheme || {};
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

    var isBrowser = typeof window !== 'undefined';
    var Hyperswitch = /** @class */ (function () {
        function Hyperswitch(options) {
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
        Hyperswitch.prototype.fetchInitialToken = function () {
            var _this = this;
            var eagerTokenPromise = (function () {
                try {
                    return _this.fetchToken();
                }
                catch (error) {
                    return Promise.reject(error);
                }
            })();
            return eagerTokenPromise.then(function (token) {
                if (token) {
                    _this.token = token;
                }
                else {
                    _this.tokenError = 'Failed to fetch token: Token returned empty or undefined';
                }
            }).catch(function (error) {
                _this.tokenError = "Failed to fetch token: ".concat(error instanceof Error ? error.message : String(error));
            });
        };
        Hyperswitch.prototype.listenForMessages = function () {
            var _this = this;
            if (!isBrowser) {
                // In SSR / non-browser environments we can't listen for postMessage events,
                // but it's still safe to create a Hyperswitch instance (it will become
                // useful on the client where another instance will typically be created).
                return;
            }
            window.addEventListener("message", function (event) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(((_a = event.data) === null || _a === void 0 ? void 0 : _a.type) === "TOKEN_EXPIRED" && ((_b = event.data) === null || _b === void 0 ? void 0 : _b.value) === true)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.refetchAndBroadcastToken()];
                        case 1:
                            _d.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            if (((_c = event.data) === null || _c === void 0 ? void 0 : _c.type) === "EMBEDDED_IFRAME_READY") {
                                // Find the element whose iframe matches the event source
                                this.activeElements.forEach(function (element) {
                                    var iframe = element.getIframe();
                                    if ((iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === event.source) {
                                        _this.onElementIframeLoaded(element);
                                    }
                                });
                            }
                            _d.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        Hyperswitch.prototype.refetchAndBroadcastToken = function () {
            return __awaiter(this, void 0, void 0, function () {
                var newToken, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isRefetchingToken) {
                                return [2 /*return*/];
                            }
                            this.isRefetchingToken = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.fetchToken()];
                        case 2:
                            newToken = _a.sent();
                            if (newToken) {
                                this.token = newToken;
                                this.tokenError = null;
                                this.activeElements.forEach(function (element, elementId) {
                                    var iframe = element.getIframe();
                                    if (iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) {
                                        iframe.contentWindow.postMessage({
                                            type: 'AUTH_TOKEN',
                                            token: _this.token
                                        }, '*');
                                    }
                                });
                            }
                            else {
                                this.tokenError = 'Failed to refetch token: Token returned empty or undefined';
                                this.sendErrorToActiveElements(this.tokenError);
                            }
                            return [3 /*break*/, 5];
                        case 3:
                            error_1 = _a.sent();
                            this.tokenError = "Failed to refetch token: ".concat(error_1 instanceof Error ? error_1.message : String(error_1));
                            this.sendErrorToActiveElements(this.tokenError);
                            return [3 /*break*/, 5];
                        case 4:
                            this.isRefetchingToken = false;
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        Hyperswitch.prototype.sendErrorToActiveElements = function (errorMessage) {
            this.activeElements.forEach(function (element) {
                var iframe = element.getIframe();
                if (iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'AUTH_ERROR',
                        error: errorMessage
                    }, '*');
                }
            });
        };
        Hyperswitch.prototype.create = function (type, options) {
            var element;
            switch (type) {
                case 'connectors':
                    element = new ConnectorConfigurationComponent(this, options);
                    break;
                default:
                    throw new Error("Unknown element type: ".concat(type));
            }
            this.activeElements.set(element._internalId, element);
            return element;
        };
        Hyperswitch.prototype.onElementIframeLoaded = function (element) {
            var _this = this;
            this.initPromise.then(function () {
                var iframe = element.getIframe();
                if (!(iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow)) {
                    return;
                }
                setTimeout(function () {
                    try {
                        var contentWindow = iframe.contentWindow;
                        if (!contentWindow) {
                            return;
                        }
                        if (_this.tokenError) {
                            contentWindow.postMessage({
                                type: 'AUTH_ERROR',
                                error: _this.tokenError
                            }, '*');
                        }
                        else if (_this.token) {
                            contentWindow.postMessage({
                                type: 'AUTH_TOKEN',
                                token: _this.token
                            }, '*');
                        }
                        else {
                            contentWindow.postMessage({
                                type: 'AUTH_ERROR',
                                error: 'No token available'
                            }, '*');
                        }
                        // Send init_config (if available) as a separate message
                        if (_this.initConfig) {
                            contentWindow.postMessage({
                                type: 'INIT_CONFIG',
                                init_config: _this.initConfig
                            }, '*');
                        }
                    }
                    catch (error) {
                    }
                }, 100);
            }).catch(function (error) {
                var iframe = element.getIframe();
                var contentWindow = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow;
                if (contentWindow) {
                    setTimeout(function () {
                        try {
                            contentWindow.postMessage({
                                type: 'AUTH_ERROR',
                                error: "Token initialization failed: ".concat(error instanceof Error ? error.message : String(error))
                            }, '*');
                        }
                        catch (_a) {
                        }
                    }, 100);
                }
            });
        };
        return Hyperswitch;
    }());
    function loadHyperswitch(options) {
        return new Hyperswitch(options);
    }

    var VERSION = '1.0.0';

    exports.ConnectorConfigurationComponent = ConnectorConfigurationComponent;
    exports.Hyperswitch = Hyperswitch;
    exports.HyperswitchElement = HyperswitchElement;
    exports.VERSION = VERSION;
    exports.loadHyperswitch = loadHyperswitch;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
