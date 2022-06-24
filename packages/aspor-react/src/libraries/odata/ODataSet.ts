import ODataCollection from "./ODataCollection";
import ODataQueryUtility from "./query/ODataQueryUtility";
import ODataRequest, {BinaryBody} from "./request/ODataRequest";
import ODataRequestMethod from "./request/ODataRequestMethod";
import {ODataResponse} from "./response/ODataResponse";
import ODataRequestType from "./request/ODataRequestType";
import {ODataCollectionResponse} from "./response/ODataCollectionResponse";
import ODataQueryable from "./query/ODataQueryable";
import ODataBase from "./ODataBase";
import ODataClient from "./ODataClient";

export default class ODataSet<Entity> extends ODataCollection<Entity> {

    post(entity : any) : ODataRequest<ODataResponse & Entity> {
        return new ODataRequest<any>(this.client(),this.url(),ODataRequestMethod.POST,ODataRequestType.ENTITY, this.formatters,entity)
    }

    postFrom(data : FormData) : ODataRequest<ODataResponse & Entity> {
        return new ODataRequest<any>(this.client(),this.url(),ODataRequestMethod.POST,ODataRequestType.ENTITY, this.formatters,data)
    }

    postBinary(files : File[] | Blob[], formName?: string) : ODataRequest<ODataResponse & Entity> {
        return new ODataRequest<any>(this.client(),this.url(),ODataRequestMethod.POST,ODataRequestType.ENTITY, this.formatters,new BinaryBody(files,formName))
    }

    action<T>(name : string, data?: any) : ODataRequest<ODataResponse & T>{
        return new ODataRequest<any>(this.client(),this.url()+"/"+name,ODataRequestMethod.POST,ODataRequestType.ENTITY, this.formatters,data)
    }

    actionForm<T>(name : string, data : FormData) : ODataRequest<ODataResponse & T>{
        return new ODataRequest<any>(this.client(),this.url()+"/"+name,ODataRequestMethod.POST,ODataRequestType.ENTITY, this.formatters,data)
    }

    actionBinary<T>(name : string, files : File[] | Blob[], formName?: string) : ODataRequest<ODataResponse & T>{
        return new ODataRequest<any>(this.client(),this.url()+"/"+name,ODataRequestMethod.POST,ODataRequestType.ENTITY, this.formatters,new BinaryBody(files,formName))
    }

    function<T>(name : string, parameters?: any) : ODataRequest<ODataResponse & T>{
        let url = this.url()+"/"+name+ODataQueryUtility.compileQueryParameters(parameters);
        return new ODataRequest<any>(this.client(),url,ODataRequestMethod.GET,ODataRequestType.ENTITY, this.formatters)
    }

    collectionFunction<T>(name : string, parameters?: any) : ODataQueryable<T> {
        let url = this.url()+"/"+name+ODataQueryUtility.compileQueryParameters(parameters);
        let base : ODataBase = {
            formatters: this.formatters,
            client(): ODataClient {
                return this.client();
            }, url(): string {
                return url;
            }
        }
        return new ODataQueryable<T>(base);
    }
}
