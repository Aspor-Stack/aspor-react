import ODataSingleQueryable from "./query/ODataSingleQueryable";
import ODataQueryUtility from "./query/ODataQueryUtility";
import {ODataQueryable} from "../../index";
import ODataRequest, {BinaryBody} from "./request/ODataRequest";
import {ODataResponse} from "./response/ODataResponse";
import ODataRequestType from "./request/ODataRequestType";
import ODataRequestMethod from "./request/ODataRequestMethod";
import {ODataCollectionResponse} from "./response/ODataCollectionResponse";
import ODataBase from "./ODataBase";
import ODataClient from "./ODataClient";

export default class ODataEntity<Entity> extends ODataSingleQueryable<Entity> {

    id(){
        return this._id;
    }

    private request(url : string, method : ODataRequestMethod, type : ODataRequestType, body?: any) : ODataRequest<any>{
        return new ODataRequest<ODataResponse & Entity>(this.client(),url,method,type, this.formatters,body)
    }

    patch(delta : any) : ODataRequest<ODataResponse & Entity> {
        return this.request(this.url(),ODataRequestMethod.PATCH,ODataRequestType.ENTITY,delta)
    }

    put(delta : any) : ODataRequest<ODataResponse & Entity> {
        return this.request(this.url(),ODataRequestMethod.PUT,ODataRequestType.ENTITY,delta)
    }

    delete() : ODataRequest<ODataResponse & Entity> {
        return this.request(this.url(),ODataRequestMethod.DELETE,ODataRequestType.ENTITY)
    }

    action<T>(name : string, data?: any) : ODataRequest<ODataResponse & T> {
        return this.request(this.url()+"/"+name,ODataRequestMethod.POST,ODataRequestType.ENTITY,data)
    }

    actionForm<T>(name : string, data : FormData) : ODataRequest<ODataResponse & T>{
        return this.request(this.url()+"/"+name,ODataRequestMethod.POST,ODataRequestType.ENTITY,data)
    }

    actionBinary<T>(name : string, files : File[] | Blob[], formName?: string) : ODataRequest<ODataResponse & T>{
        return this.request(this.url()+"/"+name,ODataRequestMethod.POST,ODataRequestType.ENTITY,new BinaryBody(files,formName))
    }

    function<T>(name : string, parameters?: any) : ODataRequest<ODataResponse & T> {
        let url = this.url()+"/"+name+ODataQueryUtility.compileQueryParameters(parameters);
        return this.request(url,ODataRequestMethod.GET,ODataRequestType.ENTITY)
    }

    collectionFunction<T>(name : string, parameters?: any) : ODataQueryable<T> {
        let base : ODataBase = {
            formatters: this.formatters,
            client(): ODataClient {
                return this.client();
            }, url(): string {
                return this.url()+"/"+name+ODataQueryUtility.compileQueryParameters(parameters);
            }
        }
        return new ODataQueryable<T>(base);
    }

}
