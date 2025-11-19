/**
 * DashboardComponent - For displaying the Hyperswitch home dashboard
 */

import { Hyperswitch } from './hyperswitch';
import { HyperswitchElement, ElementOptions } from './element';

export class DashboardComponent extends HyperswitchElement {
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    super(instance, options);
  }
  
  protected getElementType(): string {
    return 'default-home';
  }
  
  protected getIframeSrc(): string {
    const baseUrl = this.options.url || 'http://localhost:5000';
    return `${baseUrl}/default-home`;
  }
  
  /**
   * Implements the abstract method from HyperswitchElement
   * Dashboard doesn't need to send messages currently
   */
  protected postMessageToChild(messageType: string, data?: any): void {
    // Empty implementation to satisfy abstract method requirement
  }
}
