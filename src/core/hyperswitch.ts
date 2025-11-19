/**
 * Core Hyperswitch SDK implementation
 */
// Import component types
import { HyperswitchElement } from './element';
import { ConnectorListComponent } from './connector-list';
import { ConnectorConfigurationComponent } from './connector-configuration';
import { DashboardComponent } from './dashboard';

// Basic configuration type
interface HyperswitchOptions {
  baseUrl?: string;
  token?: string;
  theme?: 'light' | 'dark';
}

// Main Hyperswitch class
class Hyperswitch {
  private apiKey: string;
  private options: HyperswitchOptions;
  private authenticated: boolean = false;
  private activeElements: Map<string, HyperswitchElement> = new Map();
  private activeModal: HTMLIFrameElement | null = null;
  
  constructor(apiKey: string, options?: HyperswitchOptions) {
    this.apiKey = apiKey;
    this.options = options || {};
    this.listenForAccessoryLayerRequests();
  }
  
  // Authentication method
  async authenticate(): Promise<Hyperswitch> {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just simulate authentication
      console.log('Authenticating with API key:', this.apiKey);
      this.authenticated = true;
      return this;
    } catch (error: any) {
      console.error('Authentication failed:', error);
      throw new Error(`Authentication failed: ${error.message || 'Unknown error'}`);
    }
  }
  
  // Creates elements directly
  create(type: string, options?: any): any {
    if (!this.authenticated) {
      throw new Error('You must authenticate before creating elements');
    }
    
    // Create the appropriate component based on type
    console.log(`Creating component of type: ${type}`);
    
    let element: HyperswitchElement;

    switch (type) {
      case 'connector':
        element = new ConnectorListComponent(this, options);
        break;
        
      case 'connector-configure':
        element = new ConnectorConfigurationComponent(this, options);
        break;
        
      case 'dashboard':
        element = new DashboardComponent(this, options);
        break;
        
      default:
        throw new Error(`Unknown component type: ${type}`);
    }

    this.activeElements.set(element._internalId, element);
    return element;
  }

  private listenForAccessoryLayerRequests() {
    window.addEventListener('message', (event) => {
      const { payload, type } = event.data;

      // 1. Validate the message source and ID
     
        if (type === 'HS_CLOSE_ACCESSORY_MODAL') {
          if (this.activeModal) {
            document.body.removeChild(this.activeModal);
            this.activeModal = null;
          }
        }
       
      // 2. Handle the request
      if (payload && payload.type === 'modal') {
        this.createModalWithData(payload.url, payload.height, payload.width);
      }
    });
  }

  private createModalWithData(url: string, height?: string, width?: string) {
    // Create an iframe
    const iframe = document.createElement('iframe');
    iframe.setAttribute('allowTransparency', 'true');
    iframe.src = url;
    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      border: 'none',
      zIndex: '2147483647',
    });

    // Append elements
    document.body.appendChild(iframe);
    this.activeModal = iframe;
  }

  /**
   * TODO: This is a temporary method for testing and should be removed.
   * It allows the parent application to open a modal directly.
   * The secure, long-term solution is for components to use the
   * protected `requestAccessoryLayer` method.
   */
  public openModal(url: string, height?: string, width?: string): void {
    this.createModalWithData(url, height, width);
  }
}

// Main SDK entry point
function loadHyperswitch(apiKey: string, options?: HyperswitchOptions): Promise<Hyperswitch> {
  return new Promise((resolve, reject) => {
    try {
      // Create instance
      const instance = new Hyperswitch(apiKey, options);
      
      // Authenticate and initialize
      instance.authenticate()
        .then(() => resolve(instance))
        .catch(error => reject(error));
    } catch (error: any) {
      reject(error);
    }
  });
}



// Export the main function and class
export { loadHyperswitch, Hyperswitch };
