import { AnimationFrame } from '../react/time';
export declare const RenderFrame: ({ order, ...props }: {
    order?: number | undefined;
} & {
    timeBeforeFade?: number | undefined;
    fadeDuration?: number | undefined;
    maxDeltaTime?: number | undefined;
}) => any;
