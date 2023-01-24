import { Observable } from '../../observables';
/**
 * Allow concise className declaration. Eg:
 *
 *      const MyComp: React.FC<{ minimized: boolean }> => ({ minimized }) => {
 *        return (
 *          <div className={safeClassName('MyComp', { minimized })} />
 *        )
 *      }
 */
export declare const safeClassName: (...args: any[]) => string;
export declare function mapWithSeparator<T, U, V>(data: T[], map: (item: T, index: number) => U, separator: (autoKey: string, index: number) => V): (T | U | V)[];
type PointerType = 'mouse' | 'touch';
export declare const pointerTypeObs: Observable<PointerType>;
export declare const usePointerType: () => PointerType;
export {};
