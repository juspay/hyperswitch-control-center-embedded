/**
 * React components for Hyperswitch SDK
 */
import * as React from 'react';
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useHyperswitchInstance } from './context';
import { ElementOptions } from '../core/element';
import type { ConnectorConfigurationComponent } from '../core/connector-configuration';

/**
 * Base component props without requiring explicit hyperswitchInstance
 */
interface ComponentProps extends ElementOptions {
  // Component-specific props can be added here
}

/**
 * Handle exposed by ConnectorConfiguration component
 */
export interface ConnectorConfigurationHandle {
  openSidebar: (height?: string, width?: string) => void;
}

/**
 * ConnectorList Component for React - uses context to access hyperswitchInstance
 */
export function ConnectorList(props: ComponentProps) {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create the component using instance from context
    const component = hyperswitchInstance.create('connector', props);
    
    // Mount it to the container
    component.mount(containerRef.current);
    
    // Cleanup
    return () => {
      component.destroy();
    };
  }, [hyperswitchInstance, containerRef, props]);
  
  return <div ref={containerRef}  />;
}

/**
 * ConnectorConfiguration Component for React - uses context to access hyperswitchInstance
 * Use ref to access the openSidebar method
 */
export const ConnectorConfiguration = forwardRef<ConnectorConfigurationHandle, ComponentProps>((props, ref) => {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);
  const componentInstanceRef = useRef<ConnectorConfigurationComponent | null>(null);
  
  // Expose openSidebar method through ref
  useImperativeHandle(ref, () => ({
    openSidebar: (height?: string, width?: string) => {
      console.log('[ConnectorConfiguration] openSidebar called via ref');
      if (componentInstanceRef.current) {
        componentInstanceRef.current.openSidebar(height, width);
      }
    }
  }));
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create the component
    const component = hyperswitchInstance.create('connector-configure', props) as ConnectorConfigurationComponent;
    
    // Store the component instance
    componentInstanceRef.current = component;
    
    // Mount it to the container
    component.mount(containerRef.current);
    
    // Cleanup
    return () => {
      component.destroy();
      componentInstanceRef.current = null;
    };
  }, [hyperswitchInstance, containerRef, props]);
  
  return <div ref={containerRef} />;
});

ConnectorConfiguration.displayName = 'ConnectorConfiguration';

/**
 * Dashboard Component for React - uses context to access hyperswitchInstance
 */
export function Dashboard(props: ComponentProps) {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create the component
    const component = hyperswitchInstance.create('dashboard', props);
    
    // Mount it to the container
    component.mount(containerRef.current);
    
    // Cleanup
    return () => {
      component.destroy();
    };
  }, [hyperswitchInstance, containerRef, props]);
  
  return <div ref={containerRef}  />;
}
