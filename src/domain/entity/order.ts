import OrderItem from './order_item';

export default class Order{

    private _id : string;
    private _customer_id : string;
    private _items: OrderItem[];
    private _total!: number;

    constructor (id:string, customer_id: string, items:OrderItem[]){
        this._id = id;
        this._customer_id = customer_id;
        this._items = items;
        this._total = this.total();
        
        this.validateAll();
    }

    get id(): string{
        return this._id;
    }
    
    get customer_id(): string{
        return this._customer_id;
    }

    get items(): OrderItem[]{
        return this._items;
    }
    
    changeItems(updatedListOfItems: OrderItem[]): void{
        this._items = updatedListOfItems;
    }

    total(): number{
        return this._items.reduce( (acc, item) => acc + item.orderItemTotal(), 0 );
    }

    validateAll(){
        this.validateId();
        this.validateCustomerId();
        this.validateItems();
    }

    validateId(): boolean{
        if (this._id.length === 0){
            throw new Error("OrderId is required");
        }
        return (true);
    }
    
    validateCustomerId(): boolean{
        if (this._customer_id.length === 0){
            throw new Error("CustomerId is required");
        }
        return (true);
    }

    validateItems(): boolean{
        if (this._items.length === 0){
            throw new Error("An Order require some Item");
        }
        return (true);
    }

    toJSON(): any{
        return {

            id: this._id,
            customer_id: this._customer_id,
            total: this.total(),
            items: this._items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                product_id: item.productId,
            })), 
        }

    }
}