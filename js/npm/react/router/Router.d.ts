import React from 'react';
export declare const RouterContext: any;
type Props = {
    baseUrl?: string | RegExp;
    pathnameTransform?: null | ((pathname: string) => string);
    children?: React.ReactNode;
};
export declare const Router: ({ baseUrl, pathnameTransform, children, }: Props) => any;
export {};
