/**
 * ConnectorListComponent - For displaying and selecting payment connectors
 */

import { Hyperswitch } from './hyperswitch';
import { HyperswitchElement, ElementOptions } from './element';

export class ConnectorListComponent extends HyperswitchElement {
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    super(instance, options);
  }
  
  protected getElementType(): string {
    return 'connector';
  }
  
  protected getIframeSrc(): string {
    const baseUrl = this.options.url || 'http://localhost:5000';
    return `${baseUrl}/connector`;
  }
  
  /**
   * Implements the abstract method from HyperswitchElement
   * ConnectorList doesn't need to send messages currently
   */
  protected postMessageToChild(messageType: string, data?: any): void {
    // Empty implementation to satisfy abstract method requirement
  }
}
