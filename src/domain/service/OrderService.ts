import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import {v4 as uuid} from "uuid";
export default class OrderService{

    static placeOrder(customer: Customer, items: OrderItem[]): Order{

        /*
        // Já tem validação dos itens na Ordem
        if (items.length === 0){
            throw new Error("Order must have some item");
        }
        */

        const order = new Order(uuid(), "c1", items);
        customer.addRewardPoints(order.total()/2);

        return order;
    }

    static total(orders: Order[]): number{
        return orders.reduce((acc, order) => acc + order.total(), 0);
    }
}