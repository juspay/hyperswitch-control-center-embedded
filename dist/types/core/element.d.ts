import { Hyperswitch } from './hyperswitch';
import { ElementOptions } from './types';
declare abstract class HyperswitchElement {
    protected instance: Hyperswitch;
    protected options: ElementOptions;
    element: HTMLElement;
    protected iframe: HTMLIFrameElement;
    private boundMessageHandler;
    readonly _internalId: string;
    constructor(instance: Hyperswitch, options?: ElementOptions);
    private setupElement;
    private setupIframe;
    private handleMessage;
    mount(domNode: string | HTMLElement): HyperswitchElement;
    destroy(): void;
    protected abstract getElementType(): string;
    protected abstract getIframeSrc(): string;
    getIframe(): HTMLIFrameElement;
}
export { HyperswitchElement };
