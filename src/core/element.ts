/**
 * Base HyperswitchElement implementation - minimal version
 */

import { Hyperswitch } from './hyperswitch';

// Element options type
interface ElementOptions {
  url?: string;
  width?: string | number;
  height?: string | number;
  style?: Partial<CSSStyleDeclaration>;
  className?: string;
  onMessage?: (message: any) => void;
  onResize?: (dimensions: { width: number; height: number }) => void;
}

/**
 * Abstract base class for all Hyperswitch elements
 */
abstract class HyperswitchElement {
  protected instance: Hyperswitch;
  protected options: ElementOptions;
  public element: HTMLElement;
  protected iframe: HTMLIFrameElement;
  private boundMessageHandler;
  public readonly _internalId: string;
  
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    this.instance = instance;
    this.options = options || {};
    this._internalId = `hyper-el-${Math.random().toString(36).substring(7)}`;
    
    // Create DOM elements
    this.element = document.createElement('div');
    this.iframe = document.createElement('iframe');
    
    // Bind the message handler once to preserve reference for removal
    this.boundMessageHandler = this.handleMessage.bind(this);
    
    // Setup the elements
    this.setupElement();
    this.setupIframe();
    
    // Set up message event listeners
    window.addEventListener('message', this.boundMessageHandler);
  }
  

  private setupElement(): void {
    this.element.className = `hyperswitch-element ${this.options.className || ''}`.trim();
    this.element.dataset.hyperswitchElement = this.getElementType();
    
    // Apply styles
    Object.assign(this.element.style, {
      width: this.options.width || '100%',
      height: this.options.height || '500px',
      overflow: 'hidden',
      ...(this.options.style || {})
    });
  }
  
 
  private setupIframe(): void {
    // Set iframe attributes
    this.iframe.src = this.getIframeSrc();
    this.iframe.style.border = 'none';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.title = `Hyperswitch ${this.getElementType()}`;
    
    // Add iframe to container
    this.element.appendChild(this.iframe);
  }
  
  // @ts-ignore
  handleMessage(event /* MessageEvent */) {
    // Log incoming messages for debugging
    console.log(`[${this.getElementType()}] Received message:`, event.data);
    
    // Forward all messages to callback if provided
    if (this.options.onMessage) {
      this.options.onMessage(event.data);
    }
    
    // Handle resize events
    if (event.data?.type === 'EMBEDDED_COMPONENT_RESIZE') {
      // Get component and height data
      const newHeight = event.data.height;
      const messageComponent = event.data.component || '';
      
      // Only process if message is for this component
      if (messageComponent === this.getElementType() && typeof newHeight === 'number' && newHeight > 0) {
        console.log(`[${this.getElementType()}] Updating height to ${newHeight}px`);
        this.element.style.height = `${newHeight}px`;
        
        // Call onResize callback if provided
        if (this.options.onResize) {
          this.options.onResize({
            width: this.element.clientWidth,
            height: newHeight
          });
        }
      }
    }
  }
  
  mount(domNode: string | HTMLElement): HyperswitchElement {
    const parent = typeof domNode === 'string' 
      ? document.querySelector(domNode) 
      : domNode;
      
    if (!parent) {
      throw new Error(`Invalid mount point: ${domNode}`);
    }
    
    // Append to parent
    parent.appendChild(this.element);
    
    return this;
  }
  
  destroy(): void {
    // Remove event listener using the stored bound handler
    window.removeEventListener('message', this.boundMessageHandler);
    
    // Remove from DOM
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
 
  /**
   * Abstract method to send messages to the iframe content
   * Each component should implement this method to handle its specific message requirements
   * @param messageType The type of message to send
   * @param data Additional data to include in the message
   */
  protected abstract postMessageToChild(messageType: string, data?: any): void;
  
  protected abstract getElementType(): string;
  
  protected abstract getIframeSrc(): string;

  /**
   * Sends a secure, internal-only request to the parent Hyperswitch
   * instance to create an accessory layer, such as a modal.
   */
  protected requestAccessoryLayer(payload: { type: 'modal'; url: string; data?: any; height?: string; width?: string }): void {
    window.parent.postMessage({
      source: 'hyperswitch-element',
      elementId: this._internalId, // The unique, internal ID
      requestType: 'requestAccessoryLayer',
      payload: payload,
    }, '*'); // In production, use a specific target origin
  }
}

export { HyperswitchElement, ElementOptions };
