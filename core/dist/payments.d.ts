import { Hyperswitch } from './hyperswitch';
import { HyperswitchElement } from './element';
import { ElementOptions } from './types';
export declare class PaymentsComponent extends HyperswitchElement {
    constructor(instance: Hyperswitch, options?: ElementOptions);
    protected getElementType(): string;
    protected getIframeSrc(): string;
}
