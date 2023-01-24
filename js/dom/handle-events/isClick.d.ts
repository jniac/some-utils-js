/**
 * Returns true if the last user interaction was a "click".
 * 4 parameters help to determine if a combination of down & up events are a "click":
 * - `maxTouchCount`: How many touches could make the user? Default: 1
 * - `maxDuration`: How much time may have passed between the down & the up event? Default: .3s.
 * - `maxDistance`: How many pixels between the down and the up point? Default: 5px
 * - `minInterval`: How much time may have passed since the previous "up" event? Default: .3s.
 *
 * NOTE: Precedence is critical here. "isClick()" will likely be called on "up" events
 * ("mouseup", "click", "pointerup", "touchend"). When called "isClick" must have
 * its state ready. To do so, we use here "pointer" events because "pointer" events
 * are triggered before "mouse" & "touch" events. The "capture" flag helps to execute
 * local listeners before any other ones.
 */
export declare const isClick: ({ maxTouchCount, maxDuration, maxDistance, minInterval, }?: {
    maxTouchCount?: number | undefined;
    maxDuration?: number | undefined;
    maxDistance?: number | undefined;
    minInterval?: number | undefined;
}) => boolean;
