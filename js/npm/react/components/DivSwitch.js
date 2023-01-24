import { useMemo, forwardRef } from 'react';
import { inverseLerp, inout, in4 } from '../../../math.js';
import { Switch } from './Switch.js';
import './DivSwitch.css';
export const DivSwitch = ({ index = 0, items = [], itemProps = {}, transitionDuration = .8, debugDisplayAll = false, className = '', debug, ...props }) => {
    const mapItems = useMemo(() => {
        return items.map(Item => {
            return forwardRef(({ entering, leaving, ...props }, ref) => {
                return (<div ref={ref} className="Item" style={{ opacity: `${entering ? '0' : ''}` }}>
            <Item {...props}/>
          </div>);
            });
        });
        // items as dependencies is ok
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, items);
    return (<div className={`DivSwitch ${className}`} {...props}>
      <Switch index={index} transitionDuration={transitionDuration} items={mapItems} itemProps={itemProps} debugDisplayAll={debugDisplayAll} onTransition={(entering, leaving, t, animation) => {
            // Ensure to remove old class names when changes occurs quickly:
            entering?.classList.remove('leaving');
            leaving?.classList.remove('entering');
            // Transition update:
            if (t < 1) {
                entering?.classList.add('entering');
                leaving?.classList.add('leaving');
            }
            if (t === 1) {
                entering?.classList.remove('entering');
            }
            if (leaving) {
                const t1 = inverseLerp(0, 0.6, t);
                leaving.style.opacity = in4((1 - t1)).toFixed(2);
            }
            if (entering) {
                entering.style.opacity = t < 1 ? inout(t, 3, .3).toFixed(2) : '';
            }
        }}/>
    </div>);
};
