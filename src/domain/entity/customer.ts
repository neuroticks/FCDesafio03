import Address from "./address";

export default class Customer {
    private _id : string;
    private _name: string;
    private _address !: Address;
    private _active : boolean;
    private _rewardPoints : number = 0;

    constructor (id:string, name:string){
        this._id = id;
        this._name = name;
        this._active = false;
        this.validate_all();
    }

    get name(): string{
        return this._name;
    }
    
    get address(): Address{
        return this._address;
    }

    get rewardPoints(): number{
        return this._rewardPoints;
    }
    
    changeName(new_name:string){
        this._name = new_name;
    }    
    
    changeAddress(addr: Address){
        this._address = addr;
    }

    activate(){
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
          }
        this._active = true;
    }
    
    deactivate(){
        this._active = false;
    }
    
    isActive(): boolean{
        return this._active;
    }

    addRewardPoints(points: number){
        this._rewardPoints += points;
    }

    validate_all(){
        this.validate_id();
        this.validate_name();
    }
    
    validate_id(){
        if (this._id.length === 0)
            throw new Error("ID is required");
    }

    validate_name(){
        if (this._name.length === 0)
            throw new Error("NAME is required");
    }
}