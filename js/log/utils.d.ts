/**
 * Returns an array with text and color argument for the web console (chrome / firefox).
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/console#Usage
 */
export declare const getColorArray: (message: string) => string[];
export declare const consoleColor: (message: string) => void;
export declare const chalkConsoleInit: () => void;
