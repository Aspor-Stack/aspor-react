

export class Guid {

    private readonly _value : string;

    protected constructor(value : string) {
        this._value = value;
    }

    toString(){
        return this._value;
    }

    static new(value : string){
        return new Guid(value)
    }

}
