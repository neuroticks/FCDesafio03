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

  it("should find an existing order", async () => {
    // INI Cria Cliente com Endereço
    const cliente1 = new Customer("cliente_id_1", "cliente uno");
    const endereco1 = new Address("rua Do Cliente Uno", 1, '11222-333', "Cidade Uno");
    cliente1.changeAddress(endereco1);
    const clienteRepositorio = new CustomerRepository();
    await clienteRepositorio.create(cliente1);
    // FIM Cria Cliente com Endereço

    // INI Cria Produtos
    const produtoRepositorio = new ProductRepository();
    const produto1 = new Product("produto_id_1", "Produto One", 11);
    await produtoRepositorio.create(produto1);
    const produto2 = new Product("produto_id_2", "Produto Two", 22);
    await produtoRepositorio.create(produto2);
    const produto3 = new Product("produto_id_3", "Produto Three", 33);
    await produtoRepositorio.create(produto3);
    // FIM Cria Produtos

    // INI Cria Itens do Pedido
    const item1 = new OrderItem(produto1.id, "1", produto1.name, produto1.price, 1);
    const item2 = new OrderItem(produto2.id, "2", produto2.name, produto2.price, 2);
    const item3 = new OrderItem(produto3.id, "3", produto3.name, produto3.price, 3);
    // FIM Cria Itens do Pedido
    // INI Cria Pedido
    const pedido1 = new Order("Pedido_id_1", cliente1.id, [item1, item2, item3]);
    const pedidoRepositorio = new OrderRepository();
    await pedidoRepositorio.create(pedido1);
    // FIM Cria Pedido

    // Busca Pedido Criado
    const pedidoEncontrado = await pedidoRepositorio.find(pedido1.id);

    // Compara o RECUPERADO com o Model_utilizado_para_criação
    expect(pedidoEncontrado.toJSON()).toStrictEqual(
      {
        id: pedido1.id,
        customer_id: cliente1.id,
        total: pedido1.total(),
        items: [
          {
            id: item1.id,
            name: item1.name,
            price: item1.price,
            quantity: item1.quantity,
            // order_id: pedido1.id,
            product_id: produto1.id,
          },
          {
            id: item2.id,
            name: item2.name,
            price: item2.price,
            quantity: item2.quantity,
            // order_id: pedido1.id,
            product_id: produto2.id,
          },
          {
            id: item3.id,
            name: item3.name,
            price: item3.price,
            quantity: item3.quantity,
            // order_id: pedido1.id,
            product_id: produto3.id,
          },
        ],
      });
  });

  it("should find all orders", async () => {
    const clienteRepositorio = new CustomerRepository();

    const cliente1 = new Customer("cliente_id_1", "Cliente Uno");
    const endereco1 = new Address("Rua do cliente 1", 11, "11000-111", "Cidade One");
    cliente1.changeAddress(endereco1);
    await clienteRepositorio.create(cliente1);

    const cliente2 = new Customer("cliente_id_2", "Cliente Uno");
    const endereco2 = new Address("Rua do cliente 2", 22, "22000-222", "Cidade Two");
    cliente2.changeAddress(endereco2);
    await clienteRepositorio.create(cliente2);

    const produto1 = new Product("produto_id_1", "Produto Um", 11);
    const produto2 = new Product("produto_id_2", "Produto Dois", 22);
    const produto3 = new Product("produto_id_3", "Produto Tres", 33);
    const produto4 = new Product("produto_id_4", "Produto Quatro", 44);
    const produto5 = new Product("produto_id_5", "Produto Cinco", 55);
    const produtoRepositorio = new ProductRepository();
    await produtoRepositorio.create(produto1);
    await produtoRepositorio.create(produto2);
    await produtoRepositorio.create(produto3);
    await produtoRepositorio.create(produto4);
    await produtoRepositorio.create(produto5);

    const pedidoRepositorio = new OrderRepository();
    const item_pedido1 = new OrderItem(produto1.id, "item_pedido_id_1", "ItemNome " + produto1.name, produto1.price, 1);
    const item_pedido5 = new OrderItem(produto5.id, "item_pedido_id_5", "ItemNome " + produto5.name, produto5.price, 5);
    const pedido1 = new Order("Pedido_id_1", cliente1.id, [item_pedido1, item_pedido5]);
    await pedidoRepositorio.create(pedido1);

    const item_pedido2 = new OrderItem(produto2.id, "item_pedido_id_2", "ItemNome " + produto2.name, produto2.price, 2);
    const item_pedido4 = new OrderItem(produto4.id, "item_pedido_id_4", "ItemNome " + produto4.name, produto4.price, 4);
    const pedido2 = new Order("Pedido_id_2", cliente2.id, [item_pedido2, item_pedido4]);
    await pedidoRepositorio.create(pedido2);

    const item_pedido3 = new OrderItem(produto3.id, "item_pedido_id_3", "ItemNome " + produto3.name, produto3.price, 3);
    const pedido3 = new Order("Pedido_id_3", cliente1.id, [item_pedido3]);
    await pedidoRepositorio.create(pedido3);

    const pedido_criado = await pedidoRepositorio.findAll();

    expect(pedido_criado.length).toBe(3);

    expect(pedido_criado[1]).toStrictEqual(pedido2);
  })

  /*
    it("should update an order", async ()=>{
  
        // Considerando este modelo de [Order <--> OrderItem] parece não prático um Order.Update()
        // 1. porque a Order tem unicamente {Id, e CustomerId}, e não faz sentido mudar qualquer um deles.
  
        // Porém, faz sentido trabalhar com os OrderItems:
        // 1. Incluindo novo OrderItem na Order
        // 2. Excluindo OrderItem da Order
        // 3. Modificando quantidade do OrderItem na Order
  
        // Deixando claro que essas ponderações são válidas para o "modelo" aqui construído durante as video-aulas.
  
        expect(1).toBe(1);
     })
  */

  it("should add a new OrderItem", async () => {

    const clienteRepositorio = new CustomerRepository();

    const cliente1 = new Customer("cliente_id_1", "Cliente Uno");
    const endereco1 = new Address("Rua do cliente 1", 11, "11000-111", "Cidade One");
    cliente1.changeAddress(endereco1);
    await clienteRepositorio.create(cliente1);

    const produto1 = new Product("produto_id_1", "Produto Um", 11);
    const produto2 = new Product("produto_id_2", "Produto Dois", 22);
    const produtoRepositorio = new ProductRepository();
    await produtoRepositorio.create(produto1);
    await produtoRepositorio.create(produto2);

    const pedidoRepositorio = new OrderRepository();
    const item_pedido1 = new OrderItem(produto1.id, "item_pedido_id_1", "ItemNome " + produto1.name, produto1.price, 1);
    const item_pedido2 = new OrderItem(produto2.id, "item_pedido_id_2", "ItemNome " + produto2.name, produto2.price, 2);
    const pedido1 = new Order("Pedido_id_1", cliente1.id, [item_pedido1, item_pedido2]);
    await pedidoRepositorio.create(pedido1);

    const pedido_criado = await pedidoRepositorio.find(pedido1.id);

    expect(pedido_criado.items.length).toBe(2);

    expect(pedido_criado.items[1]).toStrictEqual(item_pedido2);

    const produto3 = new Product("produto_id_3", "Produto Três", 33);
    await produtoRepositorio.create(produto3);
    const item_pedido3 = new OrderItem(produto3.id, "item_pedido_id_3", "ItemNome " + produto3.name, produto3.price, 3);
    await pedidoRepositorio.addOrderItem(pedido1.id, item_pedido3);

    const pedido_item_excluido = await pedidoRepositorio.find(pedido1.id);

    expect(pedido_item_excluido.items.length).toBe(3);

    expect(pedido_item_excluido.items[2]).toStrictEqual(item_pedido3);
  })

  it("should exclude an OrderItem", async () => {

    const clienteRepositorio = new CustomerRepository();

    const cliente1 = new Customer("cliente_id_1", "Cliente Uno");
    const endereco1 = new Address("Rua do cliente 1", 11, "11000-111", "Cidade One");
    cliente1.changeAddress(endereco1);
    await clienteRepositorio.create(cliente1);

    const produto1 = new Product("produto_id_1", "Produto Um", 11);
    const produto2 = new Product("produto_id_2", "Produto Dois", 22);
    const produtoRepositorio = new ProductRepository();
    await produtoRepositorio.create(produto1);
    await produtoRepositorio.create(produto2);

    const pedidoRepositorio = new OrderRepository();
    const item_pedido1 = new OrderItem(produto1.id, "item_pedido_id_1", "ItemNome " + produto1.name, produto1.price, 1);
    const item_pedido2 = new OrderItem(produto2.id, "item_pedido_id_2", "ItemNome " + produto2.name, produto2.price, 2);
    const pedido1 = new Order("Pedido_id_1", cliente1.id, [item_pedido1, item_pedido2]);
    await pedidoRepositorio.create(pedido1);

    const pedido_criado = await pedidoRepositorio.find(pedido1.id);

    expect(pedido_criado.items.length).toBe(2);

    expect(pedido_criado.items[0]).toStrictEqual(item_pedido1);

    await pedidoRepositorio.excludeOrderItem(pedido1.id, item_pedido1.productId);

    const pedido_item_excluido = await pedidoRepositorio.find(pedido1.id);

    expect(pedido_item_excluido.items.length).toBe(1);

    expect(pedido_item_excluido.items[0]).toStrictEqual(item_pedido2);
  })

  // Repensando a validade do (Update an Order) 
  // estou considerando excluir todos os itens existentes e criar os novos
  it("should update an Order", async () => {

    const clienteRepositorio = new CustomerRepository();

    const cliente1 = new Customer("cliente_id_1", "Cliente Uno");
    const endereco1 = new Address("Rua do cliente 1", 11, "11000-111", "Cidade One");
    cliente1.changeAddress(endereco1);
    await clienteRepositorio.create(cliente1);

    const produto1 = new Product("produto_id_1", "Produto Um", 11);
    const produto2 = new Product("produto_id_2", "Produto Dois", 22);
    const produtoRepositorio = new ProductRepository();
    await produtoRepositorio.create(produto1);
    await produtoRepositorio.create(produto2);

    const pedidoRepositorio = new OrderRepository();
    const item_pedido1 = new OrderItem(produto1.id, "item_pedido_id_1", "ItemNome " + produto1.name, produto1.price, 1);
    const item_pedido2 = new OrderItem(produto2.id, "item_pedido_id_2", "ItemNome " + produto2.name, produto2.price, 2);
    const pedido1 = new Order("Pedido_id_1", cliente1.id, [item_pedido1, item_pedido2]);
    await pedidoRepositorio.create(pedido1);

    const pedido_criado = await pedidoRepositorio.find(pedido1.id);

    expect(pedido_criado.items.length).toBe(2);

    expect(pedido_criado.total()).toStrictEqual(55);


    const produto3 = new Product("produto_id_3", "Produto Três", 33);
    await produtoRepositorio.create(produto3);
    const item_pedido1_atualizado = new OrderItem(produto1.id, "item_pedido_id_1", "ItemNome " + produto1.name, produto1.price, 10);
    const item_pedido2_atualizado = new OrderItem(produto2.id, "item_pedido_id_2", "ItemNome " + produto2.name, produto2.price, 20);
    const item_pedido3 = new OrderItem(produto3.id, "item_pedido_id_3", "ItemNome " + produto3.name, produto3.price, 30);
    pedido1.changeItems([item_pedido1_atualizado, item_pedido2_atualizado, item_pedido3]);

    await pedidoRepositorio.update(pedido1);

    const pedido1_atualizado = await pedidoRepositorio.find(pedido1.id);

    expect(pedido1_atualizado.items.length).toBe(3);

    expect(pedido1_atualizado.total()).toStrictEqual(1540);
  })
});
