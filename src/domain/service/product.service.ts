import Product from "../entity/product";

export default class ProductService{

    static increasePriceByPercentage(products: Product[], perc:number): void{
        products.forEach(p => {
            p.changePrice(p.price + (p.price * perc / 100));
        })
    }
}