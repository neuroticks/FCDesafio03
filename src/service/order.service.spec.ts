import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./OrderService";

describe("Order service unit tets", () => {

    it("should place an order", () => {
        const customer = new Customer("c1", "Customer 1");
        const item1 = new OrderItem("p1", "i1", "Item 1", 10, 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it("should get total of all orders", () => {
        const item1o1 = new OrderItem("p1", "i1", "Item 1", 100, 1);
        const item2o1 = new OrderItem("p2", "i2", "Item 2", 200, 2);
        const order1 = new Order("o1", "c1", [item1o1, item2o1]);

        const item1o2 = new OrderItem("p1", "i1", "Item 1 da ordem 2", 600, 5);
        const item2o2 = new OrderItem("p2", "i2", "Item 2 da ordem 2", 700, 10);
        const order2 = new Order("o2", "c1", [item1o2, item2o2]);

        const total = OrderService.total([order1, order2]);

        expect(total).toBe(10500);
    });
});
