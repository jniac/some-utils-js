/**
 * Deep compare the two objects entries to determine if the objects are equivalent.
 *
 * Two objects are considered equivalent when:
 * - They share the same constructor.
 * - They have the same value for the same keys.
 */
export declare const areEquivalent: (a: any, b: any) => boolean;
export { 
/**
 * @deprecated
 * @obsolete
 * Deprecated, use 'areEquivalent' instead.
 */
areEquivalent as arraysAreEquivalent, 
/**
 * @deprecated
 * @obsolete
 * Deprecated, use 'areEquivalent' instead.
 */
areEquivalent as objectsAreEquivalent, };
