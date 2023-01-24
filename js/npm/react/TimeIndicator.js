import { appTimer, timer, useEffects } from '../react.js';
import { middleModulo } from '../../math.js';
export const TimeIndicator = ({ size = 12, margin = 4, alignMode = 'top-right', style = {}, ...props }) => {
    style.position = 'absolute';
    style.zIndex = '1';
    if (alignMode.includes('top')) {
        style.top = `${margin}px`;
    }
    else {
        style.bottom = `${margin}px`;
    }
    if (alignMode.includes('left')) {
        style.left = `${margin}px`;
    }
    else {
        style.right = `${margin}px`;
    }
    const width = size * .8 / 4;
    const height = size * 3 / 4;
    const { ref } = useEffects(function* (svg) {
        const [rect1, rect2] = svg.querySelectorAll('rect');
        const angularVelocity = 240;
        const state = {
            angle: 0,
            gap: 0,
        };
        yield appTimer.onChange(() => {
            if (timer.timeScale > .5) {
                state.angle = middleModulo(state.angle + angularVelocity * timer.deltaTime, 180);
                state.gap += (0 - state.gap) * .05;
            }
            else {
                state.angle += (0 - state.angle) * .05;
                state.gap += (size * .8 / 4 - state.gap) * .05;
            }
            rect1.style.transform = `translate(${size / 2 + state.gap}px, ${size / 2}px) rotate(${state.angle.toFixed(1)}deg)`;
            rect2.style.transform = `translate(${size / 2 - state.gap}px, ${size / 2}px) rotate(${state.angle.toFixed(1)}deg)`;
        });
    }, []);
    return (<svg ref={ref} {...props} style={style} width={size} height={size}>
      <rect x={width * -.5} y={height * -.5} width={width} height={height}/>
      <rect x={width * -.5} y={height * -.5} width={width} height={height}/>
    </svg>);
};
