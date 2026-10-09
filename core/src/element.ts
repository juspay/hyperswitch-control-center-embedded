import { Hyperswitch } from './hyperswitch';
import { ElementOptions } from './types';

const isBrowser = typeof window !== 'undefined';

abstract class HyperswitchElement {
  protected instance: Hyperswitch;
  protected options: ElementOptions;
  public element!: HTMLElement;
  protected iframe!: HTMLIFrameElement;
  private boundMessageHandler: ((event: MessageEvent) => void) | null;
  public readonly _internalId: string;
  private isFullPage: boolean = false;
  private previousBodyOverflow: string = '';
  private showIframeTimer: ReturnType<typeof setTimeout> | null = null;
  
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    this.instance = instance;
    this.options = options || {};
    this._internalId = `hyper-el-${Math.random().toString(36).substring(7)}`;
    this.boundMessageHandler = null;
    // In SSR / non-browser environments, avoid touching DOM APIs.
    // The React wrapper only creates and mounts elements on the client,
    // so it's safe for server-side usage as long as we no-op here.
    if (!isBrowser) {
      return;
    }
    
    this.element = document.createElement('div');
    this.iframe = document.createElement('iframe');
    this.boundMessageHandler = this.handleMessage.bind(this);
    
    this.setupElement();
    this.setupIframe();
    window.addEventListener('message', this.boundMessageHandler);
  }

  private setupElement(): void {
    if (!isBrowser) {
      return;
    }

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
    if (!isBrowser) {
      return;
    }

    this.iframe.src = this.getIframeSrc();
    this.iframe.style.border = 'none';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.title = `Hyperswitch ${this.getElementType()}`;
    this.iframe.setAttribute('allow', 'clipboard-read; clipboard-write; clipboard-sanitized-write');
    this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation allow-downloads');
    
    this.element.appendChild(this.iframe);
  }
  
  private handleMessage(event: MessageEvent): void {
    if (!isBrowser) {
      return;
    }

    if (this.options.onMessage) {
      this.options.onMessage(event.data);
    }
    
    if (this.isFullPageModalEnabled() && event.source === this.iframe.contentWindow) {
      if (event.data?.type === 'EMBEDDED_MODAL_OPEN') {
        this.setFullPage(true);
      } else if (event.data?.type === 'EMBEDDED_MODAL_CLOSE') {
        this.setFullPage(false);
      } else if (event.data?.type === 'EMBEDDED_MODAL_VISIBLE') {
        this.showIframe();
      }
    }
    
    if (event.data?.type === 'EMBEDDED_COMPONENT_RESIZE') {
      const newHeight = event.data.height;
      const messageComponent = event.data.component || '';
      
      if (!this.isFullPage && messageComponent === this.getElementType() && typeof newHeight === 'number' && newHeight > 0) {
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
  
  private setFullPage(isFullPage: boolean): void {
    if (isFullPage !== this.isFullPage) {
      this.isFullPage = isFullPage;
      this.iframe.style.visibility = 'hidden';
      
      if (isFullPage) {
        this.previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        Object.assign(this.iframe.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          zIndex: '2147483647'
        });
      } else {
        document.body.style.overflow = this.previousBodyOverflow;
        Object.assign(this.iframe.style, {
          position: '',
          top: '',
          left: '',
          width: '100%',
          height: '100%',
          zIndex: ''
        });
      }
      
      if (this.showIframeTimer) {
        clearTimeout(this.showIframeTimer);
      }
      this.showIframeTimer = setTimeout(() => this.showIframe(), 300);
    }
    
    this.iframe.contentWindow?.postMessage({
      type: isFullPage ? 'EMBEDDED_MODAL_OPENED' : 'EMBEDDED_MODAL_CLOSED'
    }, '*');
  }
  
  private showIframe(): void {
    if (this.showIframeTimer) {
      clearTimeout(this.showIframeTimer);
      this.showIframeTimer = null;
    }
    this.iframe.style.visibility = '';
  }
  
  mount(domNode: string | HTMLElement): HyperswitchElement {
    if (!isBrowser) {
      throw new Error('HyperswitchElement.mount can only be called in a browser environment');
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
    if (this.isFullPage) {
      this.isFullPage = false;
      document.body.style.overflow = this.previousBodyOverflow;
    }
    if (this.showIframeTimer) {
      clearTimeout(this.showIframeTimer);
      this.showIframeTimer = null;
    }
    if (this.boundMessageHandler) {
      window.removeEventListener('message', this.boundMessageHandler);
    }
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
  
  protected abstract getElementType(): string;
  protected abstract getIframeSrc(): string;

  public getIframe(): HTMLIFrameElement {
    return this.iframe;
  }

  public isFullPageModalEnabled(): boolean {
    return this.options.fullPageModals !== false;
  }
}

export { HyperswitchElement };
