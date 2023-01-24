import { Observable } from '../Observable';
export declare const setValueWithDelay: <T>(observable: Observable<T>, value: T | ((v: T) => T), seconds: number, clearOnChange?: boolean, clearPrevious?: boolean) => void;
