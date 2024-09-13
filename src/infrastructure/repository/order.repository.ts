import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customer_id,
        total: entity.total(),
        items: entity.items.map((item) => ({
          product_id: item.productId,
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      });
  };

  async find(parOrderId: string): Promise<Order> {

    const pedido_model = await OrderModel.findOne({ where: { id: parOrderId }, include: ["items"] });

    const pedido_items = pedido_model.items.map((item) => {
      let item_pedido = new OrderItem(item.product_id, item.id, item.name, item.price, item.quantity);
      return item_pedido;
    });
    const pedido_encontrado = new Order(pedido_model.id, pedido_model.customer_id, pedido_items);

    return pedido_encontrado;
  }

  async update(entity: Order): Promise<void> {
    await OrderItemModel.destroy({
      where: { order_id: entity.id }
    })

    const newItems = entity.items.map((item) => ({
      order_id: entity.id,
      product_id: item.productId,
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))

    await OrderItemModel.bulkCreate(newItems)

    await OrderModel.update(
      {
        total: entity.total()
      },
      {
        where: { id: entity.id }
      })
  }

  async findAll(): Promise<Order[]> {
    const pedidos_model = await OrderModel.findAll({ include: ["items"] });

    const pedidos_encontrados = pedidos_model.map(ped => {
      const temp_pedidos_items = ped.items.map((item) => {
        const temp_item = new OrderItem(item.product_id, item.id, item.name, item.price, item.quantity);
        return temp_item;
      })
      const temp_pedido = new Order(ped.id, ped.customer_id, temp_pedidos_items);
      return temp_pedido;
    })
    return pedidos_encontrados;
  }

  async excludeOrderItem(parOrderId: string, parOrderItemId: string): Promise<void> {
    await OrderItemModel.destroy({
      where: { order_id: parOrderId, product_id: parOrderItemId }
    })
  }

  async addOrderItem(parOrderId: string, parOrderItem: OrderItem): Promise<void> {
    await OrderItemModel.create({
      order_id: parOrderId,
      product_id: parOrderItem.productId,
      id: parOrderItem.id,
      name: parOrderItem.name,
      price: parOrderItem.price,
      quantity: parOrderItem.quantity,
    })
  }

}
