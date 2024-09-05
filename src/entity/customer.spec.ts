import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw wrror when ID is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrow("ID is required");
    })

    it("should throw wrror when NAME is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("NAME is required");
    })

    it("should change name", () => {
        //Arrange
        const customer = new Customer("999", "John Doe");

        //Act
        const new_name = "Jane Doe"
        customer.changeName(new_name);

        //Assert
        expect(customer.name).toBe(new_name);
    })
})

describe("Create customer", () => {
    it("should create a new customer", () => {
        const customer = new Customer("1", "Customer 1");
        const addr = new Address("Rua das Flores", 123, "80123-000", "Pirapora");
        customer.changeAddress(addr);

        expect(customer.address.city).toBe("Pirapora");
    })
    
    it("should activate/deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const addr = new Address("Rua das Flores", 123, "80123-000", "Pirapora");
        customer.changeAddress(addr);

        customer.activate();
        expect(customer.isActive()).toBe(true);

        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    })

    it("should throw error when address is undefined on activating a customer", () => {
        expect(() => {
          const customer = new Customer("1", "Customer 1");
          customer.activate();
        }).toThrow("Address is mandatory to activate a customer");
      });

})