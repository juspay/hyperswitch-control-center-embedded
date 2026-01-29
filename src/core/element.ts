import { Hyperswitch } from './hyperswitch';
import { ElementOptions } from './types';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

abstract class HyperswitchElement {
  protected instance: Hyperswitch;
  protected options: ElementOptions;
  public element: HTMLElement;
  protected iframe: HTMLIFrameElement;
  private boundMessageHandler: ((event: MessageEvent) => void) | null;
  public readonly _internalId: string;
  
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    this.instance = instance;
    this.options = options || {};
    this._internalId = `hyper-el-${Math.random().toString(36).substring(7)}`;

    if (!isBrowser) {
      this.element = {} as any;
      this.iframe = {} as any;
      this.boundMessageHandler = null;
      return;
    }

    // Browser-only initialisation.
    this.element = document.createElement('div');
    this.iframe = document.createElement('iframe');
    this.boundMessageHandler = this.handleMessage.bind(this);
    this.setupElement();
    this.setupIframe();
    window.addEventListener('message', this.boundMessageHandler);
  }

  private setupElement(): void {
    if (!isBrowser) return;
    this.element.className = `hyperswitch-element ${this.options.className || ''}`.trim();
    this.element.dataset.hyperswitchElement = this.getElementType();
    
    Object.assign(this.element.style, {
      width: this.options.width || '100%',
      height: this.options.height || '500px',
      overflow: 'hidden',
      ...(this.options.style || {})
    });
  }
  
  private setupIframe(): void {
    if (!isBrowser) return;
    this.iframe.src = this.getIframeSrc();
    this.iframe.style.border = 'none';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.title = `Hyperswitch ${this.getElementType()}`;
    
    this.element.appendChild(this.iframe);
  }
  
  private handleMessage(event: MessageEvent): void {
    if (!isBrowser) return;
    if (this.options.onMessage) {
      this.options.onMessage(event.data);
    }
    
    if (event.data?.type === 'EMBEDDED_COMPONENT_RESIZE') {
      const newHeight = event.data.height;
      const messageComponent = event.data.component || '';
      
      if (messageComponent === this.getElementType() && typeof newHeight === 'number' && newHeight > 0) {
        this.element.style.height = `${newHeight}px`;
        
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
    if (!isBrowser) {
      throw new Error('Hyperswitch elements can only be mounted in a browser environment.');
    }

    const parent = typeof domNode === 'string' 
      ? document.querySelector(domNode) 
      : domNode;
      
    if (!parent) {
      throw new Error(`Invalid mount point: ${domNode}`);
    }
    
    parent.appendChild(this.element);
    return this;
  }
  
  destroy(): void {
    if (!isBrowser) {
      return;
    }
    
    if (this.boundMessageHandler) {
      window.removeEventListener('message', this.boundMessageHandler);
    }
    
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
  protected abstract getElementType(): string;
  protected abstract getIframeSrc(): string;

  public getIframe(): HTMLIFrameElement {
    return this.iframe;
  }
}

export { HyperswitchElement };
