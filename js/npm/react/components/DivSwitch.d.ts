import { ElementType, HTMLAttributes } from 'react';
import './DivSwitch.css';
type Props = {
    index?: number;
    items?: ElementType[];
    itemProps?: Record<string, any>;
    transitionDuration?: number;
    debug?: string;
    debugDisplayAll?: boolean;
} & HTMLAttributes<HTMLDivElement>;
export declare const DivSwitch: ({ index, items, itemProps, transitionDuration, debugDisplayAll, className, debug, ...props }: Props) => any;
export {};
