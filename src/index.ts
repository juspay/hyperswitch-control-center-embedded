/**
 * Hyperswitch Embeddable SDK
 * A React library for embedding Hyperswitch components via iframes
 */

// ===== New Stripe-like SDK =====
// Main SDK entry point
export { loadHyperswitch } from './core/hyperswitch';

// React integration
export { HyperswitchProvider } from './react/context';

// React components
export { 
  ConnectorList, 
  ConnectorConfiguration, 
  Dashboard
} from './react/components';

// Export SDK version
export const VERSION = '1.0.0';
