import SendEmailWhenProductIsCreated_handler from "../product/handler/send-email-when-product-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain Events tests", () => {

    it ("should register an event handler", ()=>{

        const l_eventName = "ProductCreatedEvent";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler = new SendEmailWhenProductIsCreated_handler();

        l_eventDispatcher.register(l_eventName, l_eventHandler);

        expect(l_eventDispatcher.getEventHandlers[l_eventName]).toBeDefined();

        expect(l_eventDispatcher.getEventHandlers[l_eventName].length).toBe(1);
        
        expect(l_eventDispatcher.getEventHandlers[l_eventName][0]).toMatchObject(l_eventHandler);
    })

    it ("should unregister an event handler", ()=>{

        const l_eventName = "ProductCreatedEvent";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler = new SendEmailWhenProductIsCreated_handler();

        l_eventDispatcher.register(l_eventName, l_eventHandler);

        expect(l_eventDispatcher.getEventHandlers[l_eventName][0]).toMatchObject(l_eventHandler);

        l_eventDispatcher.unregister(l_eventName, l_eventHandler);

        expect(l_eventDispatcher.getEventHandlers[l_eventName]).toBeDefined();

        expect(l_eventDispatcher.getEventHandlers[l_eventName].length).toBe(0);
    })
    
    it ("should unregister ALL event handler", ()=>{

        const l_eventName1 = "ProductCreatedEvent";
        const l_eventName2 = "ComoSeFosseOutroEventoQualquer";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler1 = new SendEmailWhenProductIsCreated_handler();
        const l_eventHandler2 = new SendEmailWhenProductIsCreated_handler();

        l_eventDispatcher.register(l_eventName1, l_eventHandler1);
        l_eventDispatcher.register(l_eventName2, l_eventHandler2);

        expect(l_eventDispatcher.getEventHandlers[l_eventName1][0]).toMatchObject(l_eventHandler1);
        expect(l_eventDispatcher.getEventHandlers[l_eventName2][0]).toMatchObject(l_eventHandler2);

        l_eventDispatcher.unregisterAll();

        const x = l_eventDispatcher.getEventHandlers;
        const y = l_eventDispatcher.getEventHandlers[l_eventName1];

        expect(l_eventDispatcher.getEventHandlers).toStrictEqual({});
        expect(l_eventDispatcher.getEventHandlers).toBeUndefined;

    })

    it ("should Notify ALL event handlers", ()=>{

        const l_eventName1 = "ProductCreatedEvent";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler1 = new SendEmailWhenProductIsCreated_handler();

        l_eventDispatcher.register(l_eventName1, l_eventHandler1);

        expect(l_eventDispatcher.getEventHandlers[l_eventName1][0]).toMatchObject(l_eventHandler1);

        const l_productCreatedEvent = new ProductCreatedEvent(
            {
                nome: "Novíssimo Produto Inovador",
                descricao: "Descrição do novíssimo produto inovador",
                preco: 1500,
            }
        );

        
        //Quando executar o NOTIFY, o SendEmailWhenProductIsCreated_handler.handle() será executado
        const l_spyEventHandler = jest.spyOn(l_eventHandler1, "handle");
        // 1. dispatcher notifica sobre o evento ocorrido
        l_eventDispatcher.notify(l_productCreatedEvent);
        // 2. spy valida que handler foi executado
        expect(l_spyEventHandler).toHaveBeenCalled();

    })
})