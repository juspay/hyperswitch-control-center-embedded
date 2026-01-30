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
  private loader: HTMLDivElement;
  private isEmbedded: boolean = false;
  
  constructor(instance: Hyperswitch, options?: ElementOptions) {
    this.instance = instance;
    this.options = options || {};
    this._internalId = `hyper-el-${Math.random().toString(36).substring(7)}`;

    if (!isBrowser) {
      this.element = {} as any;
      this.iframe = {} as any;
      this.loader = {} as any;
      this.boundMessageHandler = null;
      return;
    }

    // Browser-only initialisation.
    this.element = document.createElement('div');
    this.iframe = document.createElement('iframe');
    this.loader = document.createElement('div');
    this.boundMessageHandler = this.handleMessage.bind(this);
    this.setupElement();
    this.setupLoader();
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
      position: 'relative',
      ...(this.options.style || {})
    });
  }

  private setupLoader(): void {
    if (!isBrowser) return;
    this.loader.className = 'hyperswitch-loader';
    Object.assign(this.loader.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      backgroundColor: 'white',
      zIndex: '10'
    });

    // Create spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 4px solid #e0e0e0;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: hyperswitch-spin 1s linear infinite;
    `;

    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Initialising...';
    loadingText.style.cssText = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      color: #666;
    `;

    // Add keyframes animation for spinner if not already added
    if (!document.getElementById('hyperswitch-spinner-style')) {
      const style = document.createElement('style');
      style.id = 'hyperswitch-spinner-style';
      style.textContent = `
        @keyframes hyperswitch-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    this.loader.appendChild(spinner);
    this.loader.appendChild(loadingText);
    this.element.appendChild(this.loader);
  }
  
  private setupIframe(): void {
    if (!isBrowser) return;
    this.iframe.src = this.getIframeSrc();
    this.iframe.style.border = 'none';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.title = `Hyperswitch ${this.getElementType()}`;
    this.iframe.style.position = 'relative';
    this.iframe.style.zIndex = '1';
    this.iframe.style.visibility = 'hidden';
    this.iframe.setAttribute('allow', 'clipboard-read; clipboard-write; clipboard-sanitized-write');
    this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-presentation allow-downloads');
    
    this.element.appendChild(this.iframe);
    
    // Set a timeout fallback to show the component even if EMBEDDED_IFRAME_READY is never received
    setTimeout(() => {
      if (!this.isEmbedded) {
        this.showEmbeddedComponent();
      }
    }, 10000); // 10 second timeout
  }
  
  private handleMessage(event: MessageEvent): void {
    if (!isBrowser) return;  
    if (event.data?.type === 'EMBEDDED_IFRAME_READY' && !this.isEmbedded) {
      if (event.source === this.iframe.contentWindow) {
        this.showEmbeddedComponent();
      }
    }

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

  private showEmbeddedComponent(): void {
    if (!isBrowser || this.isEmbedded) return;
    
    this.isEmbedded = true;
    
    // Hide loader and show iframe
    if (this.loader) {
      this.loader.style.display = 'none';
    }
    
    this.iframe.style.visibility = 'visible';
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
