// @ts-ignore (ignore none-existing module, of course if module does not exist this file should not be imported)
import { useEffect } from 'react';
// @ts-ignore (ignore none-existing module, of course if module does not exist this file should not be imported)
import { useThree } from '@react-three/fiber';
import { AnimationFrame, timer } from '../react/time.js';
export const ThreeAnimationFrame = (props) => {
    const { invalidate } = useThree();
    useEffect(() => {
        const { destroy } = timer.onChange(() => invalidate());
        return destroy;
    }, [invalidate]);
    return (<AnimationFrame {...props}/>);
};
