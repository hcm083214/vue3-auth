export default class EventBus {
    constructor() {
        this.events = {};
    }
    on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }
    emit(eventName, data) {
        this.events[eventName].length > 0 && this.events[eventName].forEach((fn) => {
            fn(data);
        })
    }
    off(eventName, fn) {
        if (this.events[eventName] > 0) {
            for (let i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }
}