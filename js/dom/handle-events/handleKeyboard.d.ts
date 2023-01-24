type Code = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight' | 'Space' | 'Escape' | 'Enter' | 'Meta' | 'Control' | 'Shift' | 'MetaLeft' | 'ControlLeft' | 'ShiftLeft' | 'MetaRight' | 'ControlRight' | 'ShiftRight' | 'LetterA' | 'LetterB' | 'LetterC' | 'LetterD' | 'LetterE' | 'LetterF' | 'LetterG' | 'LetterH' | 'LetterI' | 'LetterJ' | 'LetterK' | 'LetterL' | 'LetterM' | 'LetterN' | 'LetterO' | 'LetterP' | 'LetterQ' | 'LetterR' | 'LetterS' | 'LetterT' | 'LetterU' | 'LetterV' | 'LetterW' | 'LetterX' | 'LetterY' | 'LetterZ' | 'KeyA' | 'KeyB' | 'KeyC' | 'KeyD' | 'KeyE' | 'KeyF' | 'KeyG' | 'KeyH' | 'KeyI' | 'KeyJ' | 'KeyK' | 'KeyL' | 'KeyM' | 'KeyN' | 'KeyO' | 'KeyP' | 'KeyQ' | 'KeyR' | 'KeyS' | 'KeyT' | 'KeyU' | 'KeyV' | 'KeyW' | 'KeyX' | 'KeyY' | 'KeyZ';
type ListenerMask = '*' | Code | Code[] | RegExp;
type ListenerCallback = ((info: KeyboardInfo) => void) | null | undefined;
type ListenerOptions = Partial<{
    priority: number;
}>;
type ShortListener = [
    ListenerMask,
    ListenerCallback
];
type FullListener = [
    ListenerMask,
    ListenerOptions,
    ListenerCallback
];
type Listener = ShortListener | FullListener;
type Options = Partial<{
    element: HTMLElement;
    onDown: Listener[];
    onUp: Listener[];
}>;
export interface KeyboardInfo {
    event: KeyboardEvent;
    capture: () => void;
}
export declare const handleKeyboard: ({ element, onDown, onUp, }: Options) => {
    destroy: () => void;
};
export {};
