import React from 'react';
import { isClick } from '../../../../dom';
import { RouterContext } from '../Router';
export const Link = React.forwardRef(({ to, reload = false, onClick, children, ...props }, ref) => {
    const { baseUrl, go } = React.useContext(RouterContext);
    const _onClick = (event) => {
        if (isClick()) {
            event.preventDefault();
            go(to);
            onClick?.(event);
        }
    };
    return (<a {...props} ref={ref} href={`${baseUrl}${to}`} onClick={_onClick}>
      {children}
    </a>);
});
