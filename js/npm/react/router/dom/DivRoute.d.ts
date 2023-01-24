import React from 'react';
import { RouteProps } from '..';
import './DivRoute.css';
interface DivProps {
    overlay?: boolean;
    overlayBackgroundColor?: string;
    doNotPreventScrollPositionBecauseIOSIsShit?: boolean;
    onBackgroundClick?: () => void;
}
export declare const DivRoute: React.FC<RouteProps & DivProps & React.HTMLAttributes<HTMLDivElement>>;
export {};
