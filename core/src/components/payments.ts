import { Hyperswitch } from '../hyperswitch';
import { HyperswitchElement } from '../element';
import { ElementOptions } from '../types';

export class PaymentsListComponent extends HyperswitchElement {
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    super(instance, options);
  }

  protected getElementType(): string {
    return 'payments';
  }

  protected getIframeSrc(): string {
    const baseUrl = this.options.url || 'http://localhost:9000';
    return `${baseUrl}/embedded/payments`;
  }
}