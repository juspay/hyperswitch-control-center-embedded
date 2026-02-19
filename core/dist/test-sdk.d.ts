import { HyperswitchElement } from './element';
import { HyperswitchInitOptions } from './types';
declare class Hyperswitch {
    private token;
    private fetchToken;
    private initConfig;
    private activeElements;
    private isRefetchingToken;
    private initPromise;
    private tokenError;
    constructor(options: HyperswitchInitOptions);
    private fetchInitialToken;
    private listenForMessages;
    private refetchAndBroadcastToken;
    private sendErrorToActiveElements;
    create(type: string, options?: any): HyperswitchElement;
    onElementIframeLoaded(element: HyperswitchElement): void;
}
export declare function loadHyperswitch(options: HyperswitchInitOptions): Hyperswitch;
export { Hyperswitch };
