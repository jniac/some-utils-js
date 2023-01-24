import { Observable, SetValueOptions } from './Observable';
type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
/**
 * Tricky concept.
 *
 * Be aware that valueOld only refers to the previous last change state.
 * This won't work:
 *
 * ```
 * const x = new ObservableObject({ name: 'foo', age: 7 })
 * x.updateValue({ age: 8 })
 * x.valueOld.age // 7 (ok)
 * x.updateValue({ name: 'bar })
 * x.valueOld.age // 8 (ok but expected?)
 * ```
 */
export declare class ObservableObject<T> extends Observable<T> {
    constructor(initialValue: T);
    /**
     * Same as setValue but WITHOUT changing the inner value reference, but its properties only (deep copy).
     */
    updateValue(value: RecursivePartial<T> | ((v: T) => RecursivePartial<T>), { ignoreCallbacks, owner }?: SetValueOptions): boolean;
    getPropValue(path: string | (string | number | symbol)[]): any;
    onPropChange<V = any>(path: string | (string | number | symbol)[], callback: (value: V, valueOld: V, target: ObservableObject<T>) => void): import("./Observable").Destroyable;
}
export {};
