import { HyperswitchElement } from './element';
import { ConnectorConfigurationComponent } from './connector-configuration';
import { HyperswitchInitOptions } from './types';
import { buildInitConfig,InitConfig } from './init-config';

const isBrowser = typeof window !== 'undefined';

class Hyperswitch {
  private token: string | null = null;
  private fetchToken: () => Promise<string | undefined>;
  private initConfig: InitConfig | null = null;
  private activeElements: Map<string, HyperswitchElement> =     new Map();
  private isRefetchingToken: boolean = false;
  private initPromise: Promise<void>;
  private tokenError: string | null = null;

  constructor(options: HyperswitchInitOptions) {
    if (!options || typeof options.fetchToken !== 'function') {
      throw new Error('loadHyperswitch requires a fetchToken callback function');
    }

    this.fetchToken = options.fetchToken;
     this.initConfig = options.initConfig ? buildInitConfig(options.initConfig) : null;
    this.initPromise = this.fetchInitialToken();
    this.listenForMessages();
  }

  private fetchInitialToken(): Promise<void> {
    const eagerTokenPromise = (() => {
      try {
        return this.fetchToken();
      } catch (error) {
        return Promise.reject(error);
      }
    })();

    return eagerTokenPromise.then((token) => {
      if (token) {
        this.token = token;
      } else {
        this.tokenError = 'Failed to fetch token: Token returned empty or undefined';
      }
    }).catch((error) => {
      this.tokenError = `Failed to fetch token: ${error instanceof Error ? error.message : String(error)}`;
    });
  } 

  private listenForMessages(): void {
    if (!isBrowser) {
      // In SSR / non-browser environments we can't listen for postMessage events,
      // but it's still safe to create a Hyperswitch instance (it will become
      // useful on the client where another instance will typically be created).
      return;
    }

    window.addEventListener("message", async (event) => {
      if (event.data?.type === "TOKEN_EXPIRED" && event.data?.value === true) {
        await this.refetchAndBroadcastToken();
      } else if (event.data?.type === "EMBEDDED_IFRAME_READY") {
        // Find the element whose iframe matches the event source
        this.activeElements.forEach((element) => {
          const iframe = element.getIframe();
          if (iframe?.contentWindow === event.source) {
            this.onElementIframeLoaded(element);
          }
        });
      }
    });
  }

  private async refetchAndBroadcastToken(): Promise<void> {
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
          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'AUTH_TOKEN',
              token: this.token
            }, '*');
          }
        });
      } else {
        this.tokenError = 'Failed to refetch token: Token returned empty or undefined';
        this.sendErrorToActiveElements(this.tokenError);
      }
    } catch (error) {
      this.tokenError = `Failed to refetch token: ${error instanceof Error ? error.message : String(error)}`;
      this.sendErrorToActiveElements(this.tokenError);
    } finally {
      this.isRefetchingToken = false;
    }
  }

  private sendErrorToActiveElements(errorMessage: string): void {
    this.activeElements.forEach((element) => {
      const iframe = element.getIframe();
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'AUTH_ERROR',
          error: errorMessage
        }, '*');
      }
    });
  }

  public create(type: string, options?: any): HyperswitchElement {
    let element: HyperswitchElement;
    
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

  public onElementIframeLoaded(element: HyperswitchElement): void {
    this.initPromise.then(() => {
      const iframe = element.getIframe();
      if (!iframe?.contentWindow) {
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
          } else if (this.token) {
            contentWindow.postMessage({
              type: 'AUTH_TOKEN',
              token: this.token
            }, '*');
          } else {
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
        } catch (error) {
        }
      }, 100);
    }).catch((error) => {
      const iframe = element.getIframe();
      const contentWindow = iframe?.contentWindow;
      if (contentWindow) {
        setTimeout(() => {
          try {
            contentWindow.postMessage({
              type: 'AUTH_ERROR',
              error: `Token initialization failed: ${error instanceof Error ? error.message : String(error)}`
            }, '*');
          } catch {
          }
        }, 100);
      }
    });
  }
}

export function loadHyperswitch(options: HyperswitchInitOptions): Hyperswitch {
  return new Hyperswitch(options);
}

export { Hyperswitch };
