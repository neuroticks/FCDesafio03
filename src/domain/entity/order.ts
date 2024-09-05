import OrderItem from './order_item';

import { validateLocaleAndSetLanguage } from "typescript";

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
}