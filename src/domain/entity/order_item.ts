
export default class OrderItem{

    private _id : string;
    private _productId: string;
    private _name : string;
    private _price: number;
    private _quantity: number;

    constructor(productId: string, id: string, name: string
                , price: number, quantity: number){

        this._productId = productId;
        this._id = id;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
        this.validateAll();
    }
    
    get productId(): string{
        return this._productId;
    }

    get id(): string{
        return this._id;
    }

    get name(): string{
        return this._name;
    }

    get price(): number{
        return this._price;
    }

    get quantity(): number{
        return this._quantity;
    }

    orderItemTotal(): number{
        return this._price * this._quantity;
    }

    validateAll(){
        this.validateQuantity();
    }

    validateQuantity(): boolean{
        if (this._quantity <= 0){
            throw new Error("Quantity must be a positive value.");
        }
        return (true);
    }
}