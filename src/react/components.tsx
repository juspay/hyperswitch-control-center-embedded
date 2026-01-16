import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useHyperswitchInstance } from './context';
import { ElementOptions } from '../core/element';
import type { ConnectorConfigurationComponent } from '../core/connector-configuration';

interface ComponentProps extends ElementOptions {}

export const ConnectorConfiguration: React.FC<ComponentProps> = (props) => {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const component = hyperswitchInstance.create('connectors', props) as ConnectorConfigurationComponent;
    component.mount(containerRef.current);
    
    return () => {
      component.destroy();
    };
  }, [hyperswitchInstance, props]);
  
  return <div ref={containerRef} />;
};

ConnectorConfiguration.displayName = 'ConnectorConfiguration';
