import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import OrderItem from "../../domain/entity/order_item";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import Order from "../../domain/entity/order";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      ProductModel,
      OrderModel,
      OrderItemModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("cliente_id_1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const p1 = new Product("produto_id_1", "Product 1", 100);
    await productRepository.create(p1);
    const p2 = new Product("produto_id_2", "Product dois", 2);
    await productRepository.create(p2);

    const oi1 = new OrderItem(p1.id, "1", p1.name, p1.price, 10);
    const oi2 = new OrderItem(p2.id, "2", p2.name, p2.price, 200);

    const order = new Order("ordem_id_1", "cliente_id_1", [oi1, oi2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    
    expect(orderModel.toJSON()).toStrictEqual({
      id: "ordem_id_1",
      customer_id: "cliente_id_1",
      total: order.total(),
      items: [
        {
          id: oi1.id,
          name: oi1.name,
          price: oi1.price,
          quantity: oi1.quantity,
          order_id: "ordem_id_1",
          product_id: "produto_id_1",
        },
        {
          id: oi2.id,
          name: oi2.name,
          price: oi2.price,
          quantity: oi2.quantity,
          order_id: "ordem_id_1",
          product_id: "produto_id_2",
        },
      ],
    });
  });
});