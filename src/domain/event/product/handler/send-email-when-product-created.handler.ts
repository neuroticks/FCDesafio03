import EventHandlerInterface from "../../@shared/event-handler.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreated_handler implements EventHandlerInterface<ProductCreatedEvent>{

    handle(event: ProductCreatedEvent): void {
        console.log(`Sending email to ....`); //${event.eventData.email}`)
    }
}
