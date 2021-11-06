import ODataBase from "../ODataBase";

export default class Tracked<A extends any> {

    private readonly _base : ODataBase
    private readonly _id: any
    private _original : any
    private _instance? : any

    constructor(base : ODataBase,id: any,instance : A) {
        this._base = base;
        this._id = id;
        this._original = instance;
        this._instance = { ...this._original };
    }

    url(){
        return this._base.url()+"/"+this._id;
    }

    get original() : A{
        return this._original;
    }

    get instance() : A{
        return this._instance;
    }

    isDeleted(){
        return !this._instance;
    }

    hasChanges(){
        if(this.isDeleted()) throw new Error("Object is deleted")
        for (let key of Object.keys(this._original)) {
            if(this._original[key] !== this._instance[key]){
                return true;
            }
        }
        return false
    }

    getChangedProperties() : string[]{
        if(this.isDeleted()) throw new Error("Object is deleted")
        let properties = []
        for (let key of Object.keys(this._original)) {
            if(this._original[key] !== this._instance[key]){
                properties.push(key);
            }
        }
        return properties;
    }

    getChanges() : {key: string,newValue : any, oldValue: any }[]{
        if(this.isDeleted()) throw new Error("Object is deleted")
        let properties = []
        for (let key of Object.keys(this._original)) {
            if(this._original[key] !== this._instance[key]){
                properties.push({key, newValue: this._instance[key], oldValue: this._original[key]});
            }
        }
        return properties;
    }

    getDelta() : any{
        if(this.isDeleted()) throw new Error("Object is deleted")
        let delta : any = {}
        for (let key of Object.keys(this._original)) {
            if(this._original[key] !== this._instance[key]){
                delta[key] = this._instance[key];
            }
        }
        return delta;
    }

    reload() : Promise<A>{
        if(this.isDeleted()) throw new Error("Object is deleted")
        return new Promise<A>((resolve,reject)=>{
            this._base.client().get(this.url())
                .then((result)=>{
                    this._original = result;
                    this._instance = result;
                    resolve(result as A)
                }).catch(reject);
        })
    }

    commit() : Promise<A>{
        if(this.isDeleted()) throw new Error("Object is deleted")
        if(!this.hasChanges()) return Promise.resolve(this._instance);
        return new Promise<A>((resolve,reject)=>{
            this._base.client().patch(this.url(),this.getDelta())
                .then(()=>{
                    this._original = this._instance;
                    resolve(this._instance)
                }).catch(reject);
        })
    }

    delete() : Promise<void>{
        return new Promise<void>((resolve,reject)=>{
            this._base.client().delete(this.url())
                .then(()=>{
                    this._instance = null;
                    resolve()
                }).catch(reject);
        })
    }

}
