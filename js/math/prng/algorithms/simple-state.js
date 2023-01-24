export const algorithms = {
    /**
     * Used here, from the beginning, taken somewhere from [David Bau](https://github.com/davidbau/seedrandom).
     */
    'parkmiller-v1': (() => {
        const next = (n) => (n * 16807) % 0x7fffffff;
        const init = (seed = 123456) => {
            seed %= 0x7fffffff;
            seed += seed < 0 ? 0x7fffffff : 0;
            seed = seed === 0 ? 1 : seed;
            return next(seed);
        };
        const map = (n) => (n - 1) / 0x7ffffffe;
        return { next, init, map };
    })(),
    /**
     * Quite good solution with a long period of 2_147_483_646 (7ffffffe).
     *
     * The "next" method involves a division (modulo).
     */
    'parkmiller-v2': (() => {
        // const next = (n: number) => {
        //   // https://en.wikipedia.org/wiki/Lehmer_random_number_generator
        //   // No division, but instead an approximation 50% faster.
        //   n = Math.imul(n, 48271)
        //   n = (n & 0x7fffffff) + (n >> 31)
        //   return n
        // }
        const next = (n) => (n * 48271) % 0x7fffffff;
        const init = (n = 123456) => {
            n %= 0x7fffffff;
            if (n <= 0) {
                n += 0x7ffffffe;
            }
            return next(next(n));
        };
        const inv = 1 / 0x7fffffff;
        const map = (n) => n * inv;
        return { next, init, map };
    })(),
    /**
     * From [Pierre Lecuyer](http://www.iro.umontreal.ca/~lecuyer/), found [here](https://gist.github.com/blixt/f17b47c62508be59987b?permalink_comment_id=2682175#gistcomment-2682175)
     * Quite short period of 16_777_216 (0x1000000).
     */
    'lecuyer-24': (() => {
        const next = (n) => (n = Math.imul(741103597, n)) >>> 0;
        const init = (n) => {
            n %= 0x100000000;
            if (n <= 0) {
                n += 0x100000000 - 1;
            }
            if (n < 1) {
                n *= 0x100000000;
            }
        };
        const map = (n) => n / 0x100000000;
        return { next, init, map };
    })(),
};
// import('./simple-state-test')
