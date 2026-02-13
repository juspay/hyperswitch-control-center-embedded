/**
 * Options for initializing the Hyperswitch SDK
 */
export interface HyperswitchInitOptions {
  /**
   * Function that fetches token
   * @returns A promise that resolves with a new token.
   */
  fetchToken: () => Promise<string | undefined>;
};

/**
 * Options for configuring a Hyperswitch element
 */
export type ElementOptions = {
  /** Base URL for the embedded component */
  url?: string;
  /** Width of the element container */
  width?: string | number;
  /** Height of the element container */
  height?: string | number;
  /** Custom CSS styles to apply to the element */
  style?: Partial<CSSStyleDeclaration>;
  /** Additional CSS class names */
  className?: string;
  /** Callback for handling messages from the embedded iframe */
  onMessage?: (message: any) => void;
  /** Callback for handling resize events from the embedded component */
  onResize?: (dimensions: { width: number; height: number }) => void;
};
