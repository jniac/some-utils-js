type Replacer = {
    selector: (pattern: string) => string;
    style: (pattern: string) => string;
    comment: (pattern: string) => string;
};
/**
 * For simple usage only.
 *
 * Transform a "CSS" string through 3 kinds of match:
 * - "selector" (useful for prefix / transform selectors)
 * - "style" (the group of properties attached to a selector)
 * - "comment" (css comments)
 *
 * usage:
 * ```
 * const s = transformCSS(`
 * \/* a comment *\/
 * .foo[class*="bar"] {
 *   color: red;
 *   mask-image: url(lol);
 * }`, {
 *   comment: () => '',
 *   selector: s => `.qux ${s}`,
 *   style: s => {
 *     const lines = s.slice(1, -1).split(';').map(def => {
 *       if (def.trim().startsWith('mask')) {
 *         return def + `;\n  -webkit-${def.trim()}`
 *       }
 *       return def
 *     })
 *     return `{${lines.join(';')}}`
 *   },
 * })
 * console.log(s.trim())
 * ```
 * will print:
 * ```txt
 * .qux .foo[class*="bar"] {
 *   color: red;
 *   mask-image: url(lol);
 *   -webkit-mask-image: url(lol);
 * }
 * ```
 */
export declare const transformCSS: (str: string, replacer: Replacer) => string;
export {};
