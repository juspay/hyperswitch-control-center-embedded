/**
 * ConnectorConfigurationComponent - For configuring payment connectors
 */

import { Hyperswitch } from './hyperswitch';
import { HyperswitchElement, ElementOptions } from './element';

export class ConnectorConfigurationComponent extends HyperswitchElement {
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    super(instance, options);
    
    console.log(`[${this.getElementType()}] ConnectorConfigurationComponent initialized`);
    
    // Wait for iframe to load before sending initial message
    this.iframe.addEventListener('load', () => {
      console.log(`[${this.getElementType()}] Iframe loaded, setting up`);
      this.setupInternalEventListeners();
      
      // Give the iframe a moment to fully initialize its JavaScript
      setTimeout(() => {
        console.log(`[${this.getElementType()}] Setting connector to stripe after delay`);
        this.setConnectorName('adyen');
      }, 1000); // 1 second delay
    });
  }
  
  protected getElementType(): string {
    return 'connector-configure';
  }
  
  protected getIframeSrc(): string {
    const baseUrl = this.options.url || 'http://localhost:5000';
    return `${baseUrl}/connector-configure`;
  }
  
  /**
   * Sends a message to the connector configuration iframe
   * @param messageType Type of message to send
   * @param data Additional data to include
   */
  protected postMessageToChild(messageType: string, data?: any): void {
    // Debug log to confirm method is being called
    console.log(`[${this.getElementType()}] postMessageToChild called with type:`, messageType, "and data:", data);
    
    try {
      if (!this.iframe) {
        console.error(`[${this.getElementType()}] iframe is null or undefined`);
        return;
      }
      
      if (!this.iframe.contentWindow) {
        console.error(`[${this.getElementType()}] iframe.contentWindow is null or undefined`);
        return;
      }
      
      // Format message in the expected structure
      const message = {
        type: messageType,
        component: this.getElementType(),
        payload: data || {}
      };
      
      // Send the message with proper debugging
      console.log(`[${this.getElementType()}] Sending message to iframe:`, message);
      this.iframe.contentWindow.postMessage(message, '*');
      console.log(`[${this.getElementType()}] Message sent successfully`);
    } catch (error) {
      console.error(`[${this.getElementType()}] Error sending message:`, error);
    }
  }
  
  // Configure-specific methods
  setConnectorName(connectorName: string): ConnectorConfigurationComponent {
    // Update the configuration for a specific connector
    console.log(`[${this.getElementType()}] Setting connector name to:`, connectorName);
    
    // Format data properly - this is critical to match expected format based on ConnectorConfigure.tsx
    // Note that the React component uses "connector" (not "connectorName") in the payload
    const data = { connector: connectorName };
    
    // Use only the abstracted method to avoid sending duplicate messages
    this.postMessageToChild('SET_CONNECTOR', data);
    return this;
  }
  
  saveConfiguration(): ConnectorConfigurationComponent {
    // Trigger configuration save
    this.postMessageToChild('SAVE_CONFIGURATION');
    return this;
  }

  /**
   * Triggers opening of a sidebar modal in the parent component
   * This method sends a message that the parent component can listen for
   * to show a modal as a sidebar
   * @returns {ConnectorConfigurationComponent} The current instance for chaining
   */
  openSidebar(height?: string, width?: string): ConnectorConfigurationComponent {
    // Send a message to trigger the sidebar modal in parent
    console.log(`[${this.getElementType()}] Triggering sidebar modal opening`);
    this.postMessageToChild('OPEN_SIDEBAR_MODAL', { height, width });
    return this;
  }

  private setupInternalEventListeners(): void {
    // The parent listens for a specific message from the iframe
    window.addEventListener('message', (event) => {
      // Ensure the message is from our iframe
      if (event.source !== this.iframe.contentWindow) {
        return;
      }

      if (event.data && event.data.type === 'HS_OPEN_MODAL_REQUEST') {
        this.handleOpenModalRequest(event.data.payload);
      }
    });
  }

  private handleOpenModalRequest(payload: any): void {
    console.log('Received modal request from iframe. Requesting modal from parent...');
    
    this.requestAccessoryLayer({
      type: 'modal',
      url: payload.url || 'http://localhost:5000/open-modal', // Fallback URL
      data: payload.data,
      height: payload.height,
      width: payload.width,
    });
  }
}
