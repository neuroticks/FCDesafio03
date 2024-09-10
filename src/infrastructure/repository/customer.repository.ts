import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipcode: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zip,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Customer> {
    let custModel;
    try {
      custModel = await CustomerModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(id, custModel.name);
    const address = new Address(
      custModel.street,
      custModel.number,
      custModel.zipcode,
      custModel.city
    );
    customer.changeAddress(address);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const custModels = await CustomerModel.findAll();

    const customers = custModels.map((CustomerModel) => {
      let customer = new Customer(CustomerModel.id, CustomerModel.name);
      customer.addRewardPoints(CustomerModel.rewardPoints);
      const address = new Address(
        CustomerModel.street,
        CustomerModel.number,
        CustomerModel.zipcode,
        CustomerModel.city
      );
      customer.changeAddress(address);
      if (CustomerModel.active) {
        customer.activate();
      }
      return customer;
    });

    return customers;
  }
}
