import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useHyperswitchInstance } from '../context';
import { ElementOptions } from '@juspay-tech/hyperswitch-control-center-embed-core';
import type { PaymentsListComponent } from '@juspay-tech/hyperswitch-control-center-embed-core';

interface ComponentProps extends ElementOptions {}

export const PaymentsList: React.FC<ComponentProps> = (props) => {
  const hyperswitchInstance = useHyperswitchInstance();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const component = hyperswitchInstance.create('payments-list', props) as PaymentsListComponent;
    component.mount(containerRef.current);

    return () => {
      component.destroy();
    };
  }, [hyperswitchInstance, props]);

  return <div ref={containerRef} />;
};

PaymentsList.displayName = 'PaymentsList';