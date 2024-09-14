import EventInterface from "../@shared/event.interface";

export default class ProductCreatedEvent implements EventInterface{
    dateTimeOccurred: Date;
    eventData: any;

    constructor(par_eventData: any){
        this.dateTimeOccurred = new Date();
        this.eventData = par_eventData;
    }
}