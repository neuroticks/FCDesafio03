import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerAddressChangedEvent from "../customerAddress-changed.event";

export default class printMessageWhenCustomerAddressChanged_handler implements EventHandlerInterface<CustomerAddressChangedEvent>{
    handle(event: CustomerAddressChangedEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.id} - ${event.eventData.name} 
            alterado para Street:${event.eventData.address.street}, number:${event.eventData.address.number} 
            ZIP Code:${event.eventData.address.zip} City:${event.eventData.address.city}.`);
    }
}
