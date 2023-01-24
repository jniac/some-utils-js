import { ElementType } from 'react';
import { AnimationInstance } from '../../../Animation';
export type SwitchChildProps = {
    entering?: boolean;
    leaving?: boolean;
};
export type Props<T> = {
    index?: number;
    items?: ElementType[];
    itemProps?: Record<string, any>;
    transitionDuration?: number;
    onTransition?: (entering: T | null, leaving: T | null, progress: number, animation: AnimationInstance) => void;
    debugDisplayAll?: boolean;
};
export declare const Switch: <T extends unknown>({ index, items, itemProps, transitionDuration, debugDisplayAll, onTransition, }: Props<T>) => any;
