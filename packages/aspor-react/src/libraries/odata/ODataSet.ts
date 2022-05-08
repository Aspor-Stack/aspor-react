import ODataCollection from "./ODataCollection";
import ODataQueryUtility from "./query/ODataQueryUtility";
import {ODataQueryable} from "../../index";

export default class ODataSet<Entity> extends ODataCollection<Entity> {

    post(entity : any) : Promise<Entity> {
        return this._base.client().post<Entity>(this.url(),entity);
    }

    postFrom(data : FormData) : Promise<Entity> {
        return this._base.client().postForm<Entity>(this.url(),data);
    }

    postBinary(files : File[] | Blob[], formName?: string) : Promise<Entity> {
        return this._base.client().postBinary<Entity>(this.url(),files,formName);
    }

    action<T>(name : string, data?: any) : Promise<T>{
        return this._base.client().post<T>(this.url()+"/"+name,data);
    }

    actionForm<T>(name : string, data : FormData) : Promise<T>{
        return this._base.client().postForm<T>(this.url()+"/"+name,data);
    }

    actionBinary<T>(name : string, files : File[] | Blob[], formName?: string) : Promise<T>{
        return this._base.client().postBinary<T>(this.url()+"/"+name,files,formName);
    }

    function<T>(name : string, parameters?: any) : Promise<T>{
        return this._base.client().get<T>(this.url()+"/"+name+ODataQueryUtility.compileQueryParameters(parameters));
    }

    collectionFunction<T>(name : string, parameters?: any) : ODataQueryable<T> {
        let url = name+ODataQueryUtility.compileQueryParameters(parameters);
        return new ODataQueryable(this,url)
    }
}
