import ODataCollection from "./ODataCollection";
import ODataQueryUtility from "./query/ODataQueryUtility";
import {ODataQueryable} from "../../index";

export default class ODataSet<Entity> extends ODataCollection<Entity> {

    post(entity : any) : Promise<Entity> {
        return this._base.client().post<Entity>(this.url(),entity);
    }

    action<T>(name : string, data?: any) : Promise<T>{
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
