import { Observable, SetValueOptions } from './Observable';
export declare class ObservableBitmask16 extends Observable<number> {
    constructor(initialMask: number);
    test(mask: number): boolean;
    maskChanged(mask: number): boolean;
    onMaskChange(mask: number, callback: (match: boolean) => void, { execute }?: {
        execute?: boolean | undefined;
    }): import("./Observable").Destroyable;
    toggle(mask: number, mode?: boolean | ('normal' | 'inverse' | 'toggle'), options?: SetValueOptions): void;
}
