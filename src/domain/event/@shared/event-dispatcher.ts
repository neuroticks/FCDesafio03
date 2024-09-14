import EventDispatcherInterface from "./event-dispatcher.inteface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface{

    private eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

    get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
        return this.eventHandlers;
    }

    notify(par_event: EventInterface): void {
        const l_eventName = par_event.constructor.name;
        
        if ( this.eventHandlers[l_eventName] ){
            this.eventHandlers[l_eventName].forEach((ll_eventHandler)=>{
                ll_eventHandler.handle(par_event)
            })
        }
    }

    register(eventName: string, eventHandler: EventHandlerInterface): void {
        if ( !this.eventHandlers[eventName] ){
            this.eventHandlers[eventName] = [];
        }
        this.eventHandlers[eventName].push(eventHandler);
    }

    unregister(par_eventName: string, par_eventHandler: EventHandlerInterface): void {
        if ( this.eventHandlers[par_eventName] ){
            const l_index = this.eventHandlers[par_eventName].indexOf(par_eventHandler);
            if ( l_index !== -1 ){
                this.eventHandlers[par_eventName].splice(l_index, 1);
            }
        }
    }

    unregisterAll(): void {
        this.eventHandlers = {};
    }


}