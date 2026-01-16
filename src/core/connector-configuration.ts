import { Hyperswitch } from './hyperswitch';
import { HyperswitchElement, ElementOptions } from './element';

export class ConnectorConfigurationComponent extends HyperswitchElement {
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    super(instance, options);
  }
  
  protected getElementType(): string {
    return 'connectors';
  }
  
  protected getIframeSrc(): string {
    const baseUrl = this.options.url || 'http://localhost:9000';
    return `${baseUrl}/embedded/connectors`;
  }
}
