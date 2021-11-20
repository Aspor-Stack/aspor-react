import ODataSingleQueryable from "./query/ODataSingleQueryable";
import ODataQueryUtility from "./query/ODataQueryUtility";
import {ODataQueryable} from "../../index";

export default class ODataEntity<Entity> extends ODataSingleQueryable<Entity> {

    id(){
        return this._id;
    }

    patch(delta : any) {
        return this._base.client().patch(this.url(),delta);
    }

    put(delta : any) {
        return this._base.client().put(this.url(),delta);
    }

    delete() {
        return this._base.client().delete(this.url());
    }

    action<T>(name : string, data: any) : Promise<T>{
        return this._base.client().post<T>(this.url()+"/"+name,data);
    }

    function<T>(name : string, parameters?: any) : Promise<T>{
        return this._base.client().get<T>(this.url()+"/"+name+ODataQueryUtility.compileQueryParameterValue(parameters));
    }

    collectionFunction<T>(name : string, parameters?: any) : ODataQueryable<T> {
        let url = name+ODataQueryUtility.compileQueryParameterValue(parameters);
        return new ODataQueryable(this,url)
    }
}
