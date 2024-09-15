import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class printMessageTwoWhenCustomerCreated_handler implements EventHandlerInterface<CustomerCreatedEvent>{
    handle(event: CustomerCreatedEvent): void {
        console.log(`Esse é o segundo consoleLog do evento [CustomerCreated].`);
    }
}
