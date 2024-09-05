export default class Product {
    private _id: string;
    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        this._id = id;
        this._name = name;
        this._price = price;
        this.validateAll();
    }

    get name(): string{
        return( this._name );
    }

    get price(): number{
        return(this._price);
    }

    changeName(name:string){
        this._name = name;
    }

    changePrice(price:number){
        this._price = price;
    }

    validateAll() {
        this.validateId();
        this.validateName();
        this.validatePrice();
    }

    validateId(): boolean {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        return true;
    }

    validateName(): boolean {
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        return true;
    }

    validatePrice(): boolean {
        if (this._price < 0) {
            throw new Error("Price must be greater than zero");
        }
        return true;
    }
}