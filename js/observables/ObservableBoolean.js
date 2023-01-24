import { Observable } from './Observable.js';
export class ObservableBoolean extends Observable {
    isTrue() {
        return this.value;
    }
    isFalse() {
        return this.value === false;
    }
    onTrue(callback, { execute = false } = {}) {
        return this.onValue(true, callback, { execute });
    }
    onFalse(callback, { execute = false } = {}) {
        return this.onValue(false, callback, { execute });
    }
    whenTrue(option) {
        return this.when(value => value === true, option);
    }
    whenFalse(option) {
        return this.when(value => value === false, option);
    }
    toggle() {
        this.setValue(!this.value);
        return this;
    }
    setTrue(option) {
        return this.setValue(true, option);
    }
    setFalse(option) {
        return this.setValue(false, option);
    }
}
