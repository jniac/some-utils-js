export declare class CallbackStack<T = undefined> {
    #private;
    constructor();
    constructor(scope: T);
    add(callback: (scope: T) => void): {
        destroy: () => boolean;
    };
    addOnce(callback: (scope: T) => void): {
        destroy: () => boolean;
    };
    delete(callback: (scope: T) => void): boolean;
    call(): void;
    dump(): void;
    /**
     * This will execute and remove from the stack as many callbacks that it is
     * possible in the given max duration (ms).
     *
     * NOTE: This concept may be better implemented with Array than Set.
     * @param maxDuration ms
     */
    dumpWhile(maxDuration: number): void;
}
