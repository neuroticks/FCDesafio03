import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {

    it("should throw error when ID is empty", () => {
        expect(() => {
            let order = new Order("", "c1", []);

        }).toThrow("OrderId is required");
    });

    it("should throw error when CustomerId is empty", () => {
        expect(() => {
            let order = new Order("o1", "", []);

        }).toThrow("CustomerId is required");
    });

    it("should throw error when Order has none Item", () => {
        expect(() => {
            let order = new Order("o1", "c1", []);

        }).toThrow("An Order require some Item");
    });

    it("should calculate total", () => {
        const item = new OrderItem("p1", "i1", "Item 1", 100, 3);
        const item2 = new OrderItem("p2", "i2", "Item 2", 200, 1);
        const order = new Order("o1", "c1", [item]);

        let total = order.total();

        expect(order.total()).toBe(300);

        const order2 = new Order("o1", "c1", [item, item2]);
        total = order2.total();
        expect(total).toBe(500);
    });

    it("should throw error if the item qte is less or equal zero 0", () => {
        expect(() => {
            const item = new OrderItem("p1", "i1", "Item 1", 100, 0);
            const order = new Order("o1", "c1", [item]);
        }).toThrow("Quantity must be a positive value.");
    });
})