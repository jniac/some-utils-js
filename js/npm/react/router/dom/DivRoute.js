import React from 'react';
import { useComplexEffects, safeClassName } from '../...js';
import { Route, RouteStateContext } from '..';
//   // THE-SCROLL_PROBLEM
// import { getScrollingParentElement, 
//   // getScrollingParentElementHeight, 
//   onFrameOrResize } from './utils.js'
// import { manageOverlayScroll } from './manageOverlayScroll.js'
import './DivRoute.css';
const Div = ({ overlay, overlayBackgroundColor, doNotPreventScrollPositionBecauseIOSIsShit = false, onBackgroundClick, children, ...props }) => {
    const state = React.useContext(RouteStateContext);
    const divRef = React.useRef(null);
    const childRef = React.useRef(null);
    useComplexEffects(function* () {
        childRef.current.onclick = event => {
            if (event.target === childRef.current) {
                onBackgroundClick?.();
            }
        };
        // Adding status to the Route classlist.
        // This is important for things such as remove pointer events on "leaving" phase.
        yield state.status.onChange((value, { valueOld }) => {
            const div = divRef.current;
            if (div) {
                div.classList.add(value);
                div.classList.remove(valueOld);
            }
        }, { execute: true });
        // Setting the opacity
        yield state.alpha.onChange(value => {
            const child = childRef.current;
            if (child) {
                if (value < 1) {
                    child.style.setProperty('opacity', value.toFixed(2));
                }
                else {
                    child.style.removeProperty('opacity');
                }
            }
        }, { execute: true });
        // if (overlay) {
        //   if (overlayBackgroundColor) {
        //     // overlayBackgroundColor is cool on Safari iOS (avoid to see the body underneath)
        //     // but that should only be set when transition is almost done
        //     yield state.alpha.onPassAbove(.999, () => divRef.current!.style.backgroundColor = overlayBackgroundColor)
        //     yield state.alpha.onPassBelow(.999, () => divRef.current!.style.backgroundColor = '')
        //   }
        //   const child = childRef.current!
        //   const scrollingElement = getScrollingParentElement(child)
        //   // Resize and place the child according to the current scroll and window states.
        //   yield onFrameOrResize(() => {
        //     const y = scrollingElement.scrollTop
        //     if (doNotPreventScrollPositionBecauseIOSIsShit === false) {
        //       child.style.top = `${y}px`
        //     }
        //     // THE-SCROLL_PROBLEM
        //     // child.style.height = `${getScrollingParentElementHeight(child)}px`
        //   }, { frameCount: 600 })
        //   yield manageOverlayScroll(child)
        // }
    }, [overlay]);
    return (<div ref={divRef} className={safeClassName('DivRoute', { overlay })}>
      <div ref={childRef} {...props}>
        {children}
      </div>
    </div>);
};
export const DivRoute = ({ 
// RouteProps
path, excludePath, exact, search, hash, transitionDuration, debug, 
// DivProps + HTMLDivElement
...props }) => (<Route {...{ path, excludePath, exact, search, hash, transitionDuration, debug }}>
    <Div {...props}/>
  </Route>);
