import SendEmailWhenProductIsCreated_handler from "../product/handler/send-email-when-product-created.handler";
import EventDispatcher from "./event-dispatcher";

describe("Domain Events tests", () => {

    it ("should register an event handler", ()=>{

        const l_eventMessage = "ProductCreatedEvent";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler = new SendEmailWhenProductIsCreated_handler();

        l_eventDispatcher.register(l_eventMessage, l_eventHandler);

        expect(l_eventDispatcher.getEventHandlers[l_eventMessage]).toBeDefined();

        expect(l_eventDispatcher.getEventHandlers[l_eventMessage].length).toBe(1);
        
        expect(l_eventDispatcher.getEventHandlers[l_eventMessage][0]).toMatchObject(l_eventHandler);
    })

    
})