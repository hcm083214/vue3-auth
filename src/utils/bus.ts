import type { InjectionKey } from 'vue'

interface Events {
    [eventName: symbol]: Function[]
}
export const $busKey = Symbol("key") as InjectionKey<EventBus>
export default class EventBus {
    events: Events
    
    static sidebarHandler = Symbol("sidebarHandler")
    constructor() {
        this.events = {} as Events;
    }
    on(eventName: symbol, fn: Function) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }
    emit(eventName: symbol, data: any) {
        this.events[eventName].length > 0 && this.events[eventName].forEach((fn) => {
            fn(data);
        })
    }
    off(eventName: symbol, fn: Function) {
        if (this.events[eventName].length > 0) {
            for (let i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }
}