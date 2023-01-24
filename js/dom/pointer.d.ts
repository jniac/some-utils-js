import { Observable, ObservableBoolean, ObservableObject } from '../observables';
export declare const pointerInfo: {
    position: ObservableObject<{
        x: number;
        y: number;
        down: boolean;
    }>;
    readonly positionDelta: {
        x: number;
        y: number;
    };
    downTarget: Observable<HTMLElement>;
    down: ObservableObject<{
        position: {
            x: number;
            y: number;
        };
        time: number;
    }>;
    upTarget: Observable<HTMLElement>;
    up: ObservableObject<{
        position: {
            x: number;
            y: number;
        };
        time: number;
    }>;
    isDown: ObservableBoolean;
};
