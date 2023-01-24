import React from 'react';
export const useArraySolverChild = (solver, initialValue) => {
    const child = React.useMemo(() => solver.createChild(initialValue), [solver, initialValue]);
    React.useEffect(() => child.destroy, [child]);
    return child;
};
export const useArraySolverImmutableChild = (solver, initialValue) => {
    const { destroy } = React.useMemo(() => solver.createImmutableChild(initialValue), [solver, initialValue]);
    React.useEffect(() => destroy, [destroy]);
};
