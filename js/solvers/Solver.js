import { Observable } from '../observables.js';
export const solve = (observable, state, solver) => {
    observable.own(observable);
    const initialValue = observable.value;
    const update = () => observable.setValue(solver(state) ?? initialValue, {
        owner: observable,
    });
    for (const child of Object.values(state)) {
        child.onChange(update);
    }
    return update;
};
export class Solver extends Observable {
    constructor(initialValue, state, solver) {
        super(initialValue);
        solve(this, state, solver);
    }
}
export class ArraySolver extends Observable {
    #children;
    #update;
    constructor(initialValue, solver) {
        super(initialValue);
        this.own(this);
        this.#children = new Set();
        this.#update = () => {
            const values = [...this.#children];
            const value = values.length > 0 ? solver(values) : initialValue;
            super.setValue(value, { owner: this });
        };
    }
    createChild(initialValue) {
        const child = new Observable(initialValue);
        child.onChange(this.#update);
        child.onDestroy(() => {
            this.#children.delete(child);
            this.#update();
        });
        this.#children.add(child);
        this.#update();
        return child;
    }
    createImmutableChild(value) {
        const { destroy } = this.createChild(value);
        return { destroy };
    }
}
