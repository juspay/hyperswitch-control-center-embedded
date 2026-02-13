/**
 * React context for Hyperswitch SDK
 */
import React, { createContext, useContext, ReactNode } from 'react';
import { Hyperswitch } from '../core/hyperswitch';

// Create context
const HyperswitchContext = createContext<Hyperswitch | null>(null);

// Props for provider component
interface HyperswitchProviderProps {
  hyperswitchInstance: Hyperswitch;
  children: ReactNode;
}

/**
 * Provider component to make Hyperswitch instance available throughout React component tree
 */
export function HyperswitchProvider({ hyperswitchInstance, children }: HyperswitchProviderProps) {
  return (
    <HyperswitchContext.Provider value={hyperswitchInstance}>
      {children}
    </HyperswitchContext.Provider>
  );
}

/**
 * Hook to access the Hyperswitch instance
 */
export function useHyperswitchInstance(): Hyperswitch {
  const context = useContext(HyperswitchContext);
  if (!context) {
    throw new Error('useHyperswitchInstance must be used within a HyperswitchProvider');
  }
  return context;
}
