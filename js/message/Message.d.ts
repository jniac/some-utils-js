export interface IMessage {
    target: any;
    type: any;
    props?: any;
    sendModality?: ISendModality;
}
export interface IMessageSent {
    stopPropagation: () => void;
}
interface ISendModality {
    propagation: (currentTarget: any) => any[];
}
export declare function send<M extends IMessage = any>(message: M): M;
export declare function send<M extends IMessage = any>(target: M['target'], type: M['type'], props?: M['props'], modality?: ISendModality): M;
export declare const on: <M extends IMessage>(target: M["target"], type: M["type"] | M["type"][], callback: (message: M & IMessageSent) => void, { priority, }?: {
    priority?: number | undefined;
}) => {
    destroy: () => void;
};
export type { IMessage as Message };
