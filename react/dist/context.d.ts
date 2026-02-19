/**
 * React context for Hyperswitch SDK
 */
import React, { ReactNode } from 'react';
import { Hyperswitch } from '@juspay-tech/hyper-dashboard-embed-core';
interface HyperswitchProviderProps {
    hyperswitchInstance: Hyperswitch;
    children: ReactNode;
}
/**
 * Provider component to make Hyperswitch instance available throughout React component tree
 */
export declare function HyperswitchProvider({ hyperswitchInstance, children }: HyperswitchProviderProps): React.JSX.Element;
/**
 * Hook to access the Hyperswitch instance
 */
export declare function useHyperswitchInstance(): Hyperswitch;
export {};
