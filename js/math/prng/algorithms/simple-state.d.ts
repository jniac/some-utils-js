type SimpleStatePRNGAlgorithm = {
    /** Init the algorithm with a seed (optional). */
    init: (seed?: number) => number;
    /** Get the next pseudo random number (unclamped). */
    next: (state: number) => number;
    /** Map the returned numbers to the [0-1] range. */
    map: (state: number) => number;
};
export declare const algorithms: {
    /**
     * Used here, from the beginning, taken somewhere from [David Bau](https://github.com/davidbau/seedrandom).
     */
    'parkmiller-v1': SimpleStatePRNGAlgorithm;
    /**
     * Quite good solution with a long period of 2_147_483_646 (7ffffffe).
     *
     * The "next" method involves a division (modulo).
     */
    'parkmiller-v2': SimpleStatePRNGAlgorithm;
    /**
     * From [Pierre Lecuyer](http://www.iro.umontreal.ca/~lecuyer/), found [here](https://gist.github.com/blixt/f17b47c62508be59987b?permalink_comment_id=2682175#gistcomment-2682175)
     * Quite short period of 16_777_216 (0x1000000).
     */
    'lecuyer-24': SimpleStatePRNGAlgorithm;
};
export type AlgorithmName = keyof typeof algorithms;
export {};
