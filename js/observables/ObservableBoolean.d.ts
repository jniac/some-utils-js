import { Observable, ObservableCallback, SetValueOptions, WhenOptionA, WhenOptionB } from './Observable';
export declare class ObservableBoolean extends Observable<boolean> {
    isTrue(): boolean;
    isFalse(): boolean;
    onTrue(callback: ObservableCallback<boolean>, { execute }?: {
        execute?: boolean | undefined;
    }): import("./Observable").Destroyable;
    onFalse(callback: ObservableCallback<boolean>, { execute }?: {
        execute?: boolean | undefined;
    }): import("./Observable").Destroyable;
    whenTrue(option: WhenOptionA<boolean> | WhenOptionB<boolean>): import("./Observable").Destroyable;
    whenFalse(option: WhenOptionA<boolean> | WhenOptionB<boolean>): import("./Observable").Destroyable;
    toggle(): this;
    setTrue(option?: SetValueOptions): boolean;
    setFalse(option?: SetValueOptions): boolean;
}
