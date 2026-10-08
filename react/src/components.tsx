import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useHyperswitchInstance } from './context';
import { ElementOptions } from '@juspay-tech/hyperswitch-control-center-embed-core';
import type {
  ConnectorConfigurationComponent,
  PaymentsComponent,
  RefundsComponent,
} from '@juspay-tech/hyperswitch-control-center-embed-core';

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

export const PaymentsList: React.FC<ComponentProps> = (props) => {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const component = hyperswitchInstance.create('payments', props) as PaymentsComponent;
    component.mount(containerRef.current);
    
    return () => {
      component.destroy();
    };
  }, [hyperswitchInstance, props]);
  
  return <div ref={containerRef} />;
};

PaymentsList.displayName = 'PaymentsList';

export const RefundsList: React.FC<ComponentProps> = (props) => {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const component = hyperswitchInstance.create('refunds', props) as RefundsComponent;
    component.mount(containerRef.current);
    
    return () => {
      component.destroy();
    };
  }, [hyperswitchInstance, props]);
  
  return <div ref={containerRef} />;
};

RefundsList.displayName = 'RefundsList';
