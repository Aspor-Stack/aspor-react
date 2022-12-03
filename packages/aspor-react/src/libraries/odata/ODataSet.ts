import ODataCollection from "./ODataCollection";
import ODataQueryUtility from "./query/ODataQueryUtility";
import ODataRequest, {BinaryBody} from "./request/ODataRequest";
import ODataRequestMethod from "./request/ODataRequestMethod";
import {ODataResponse} from "./response/ODataResponse";
import ODataRequestType from "./request/ODataRequestType";
import ODataQueryable from "./query/ODataQueryable";
import ODataEntity from "./ODataEntity";

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

    function<T>(name : string, parameters?: any) : ODataEntity<T>{
        let url = name+ODataQueryUtility.compileQueryParameters(parameters)
        return new ODataEntity<T>(this,url);
    }

    collectionFunction<T>(name : string, parameters?: any) : ODataQueryable<T> {
        let url = name+ODataQueryUtility.compileQueryParameters(parameters);
        return new ODataQueryable<T>(this, url);
    }
}
