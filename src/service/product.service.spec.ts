import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product service unit tests", () => {
  // este método é somente para praticar a aplicação de ServiceDomain
  /* em um caso concreto, uma atualização de preços para todos os produtos
     seria realizado de forma mais otimizada através de um update na tabela de preços.
  */
  it("should change the prices of all products", () => {
    const p1 = new Product("p1", "Product 1", 10);
    const p2 = new Product("p2", "Product 2", 20);
    const products = [p1, p2];
    
    ProductService.increasePriceByPercentage(products, 10);
    
    expect(p1.price).toBe(11);
    expect(p2.price).toBe(22);
  });
  
});
