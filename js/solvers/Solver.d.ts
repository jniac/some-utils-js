import { Observable } from '../observables';
type SolverState = Record<string, Observable<any>> | Observable<any>[];
export declare const solve: <T, S extends SolverState>(observable: Observable<T>, state: S, solver: (state: S) => T | undefined) => () => boolean;
export declare class Solver<T, S extends SolverState> extends Observable<T> {
    constructor(initialValue: T, state: S, solver: (state: S) => T | undefined);
}
export declare class ArraySolver<T> extends Observable<T> {
    #private;
    constructor(initialValue: T, solver: (children: Observable<T>[]) => T);
    createChild(initialValue: T): Observable<T>;
    createImmutableChild(value: T): {
        destroy: () => void;
    };
}
export {};
