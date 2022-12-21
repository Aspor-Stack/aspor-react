import ODataResponse from "../response/ODataResponse";
import ODataRequest from "../request/ODataRequest";
import ODataBatch from "../ODataBatch";

export interface IODataAuthorizationHandler {

    handleODataClientAuthorization() : Promise<string|undefined>

}

export default interface ODataClient {

    get base() : string

    get authorizationHandler() : IODataAuthorizationHandler

    execute<T extends ODataResponse>(request : ODataRequest<T>) : Promise<T|null>

    executeBatch(batch : ODataBatch) : Promise<ODataResponse[]>

}
