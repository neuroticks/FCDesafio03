import Address from "../../entity/address";
import Customer from "../../entity/customer";
import EventDispatcher from "../@shared/event-dispatcher";
import printMessageWhenCustomerAddressChanged_handler from "./handler/printMessage-when-customerAddressUpdated.handler";
import printMessageOneWhenCustomerCreated_handler from "./handler/printMessageOne-when-customerCreated.handler";
import printMessageTwoWhenCustomerCreated_handler from "./handler/printMessageTwo-when-customerCreated.handler";

describe("Customer events", () => {
    it("should Notify when CustomerCreated", () => {

        const l_eventName1 = "CustomerCreatedEvent";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler1 = new printMessageOneWhenCustomerCreated_handler();
        const l_eventHandler2 = new printMessageTwoWhenCustomerCreated_handler();

        l_eventDispatcher.register(l_eventName1, l_eventHandler1);
        l_eventDispatcher.register(l_eventName1, l_eventHandler2);

        expect(l_eventDispatcher.getEventHandlers[l_eventName1][0]).toMatchObject(l_eventHandler1);

        //Quando executar o NOTIFY, o SendEmailWhenProductIsCreated_handler.handle() será executado
        const l_spyEventHandler = jest.spyOn(l_eventHandler1, "handle");
        // 1. ao criar o cliente, notifica sobre o evento ocorrido
        const cliente = new Customer("cliente_id_1", "nome cliente uno", l_eventDispatcher);

        // 2. spy valida que handler foi executado
        expect(l_spyEventHandler).toHaveBeenCalled();

    })

    it("should Notify when CustomerAddressChanged", () => {

        const l_eventName1 = "CustomerAddressChangedEvent";

        const l_eventDispatcher = new EventDispatcher();
        const l_eventHandler1 = new printMessageWhenCustomerAddressChanged_handler();

        l_eventDispatcher.register(l_eventName1, l_eventHandler1);

        expect(l_eventDispatcher.getEventHandlers[l_eventName1][0]).toMatchObject(l_eventHandler1);

        //Quando executar o NOTIFY, o SendEmailWhenProductIsCreated_handler.handle() será executado
        const l_spyEventHandler = jest.spyOn(l_eventHandler1, "handle");
        
        // 1. ao criar o cliente, notifica sobre o evento ocorrido
        const cliente = new Customer("598", "Cinco Nove Oito", l_eventDispatcher);
        const endereco = new Address("Rua piraporinha", 11, "11222-333", "Pirapora do Oeste Distante");
        cliente.changeAddress(endereco);

        // 2. spy valida que handler foi executado
        expect(l_spyEventHandler).toHaveBeenCalled();

    })
})