import ODataClient, {IODataAuthorizationHandler} from "./ODataClient";
import ODataResponse from "../response/ODataResponse";
import ODataRequest, {BinaryBody} from "../request/ODataRequest";
import ODataRequestMethod from "../request/ODataRequestMethod";
import ODataBatch from "../ODataBatch";
import ODataClientUtil from "./ODataClientUtil";

export default class FetchODataClient implements ODataClient {

    private readonly _base : string
    private readonly _authorizationHandler? : IODataAuthorizationHandler
    private readonly _fetchConfigBuilder? : (formRequest?: boolean)=>Promise<RequestInit>

    constructor(base : string, authorizationHandler? : IODataAuthorizationHandler, fetchConfigBuilder? : (formRequest?: boolean)=>Promise<RequestInit>) {
        this._base = base;
        this._authorizationHandler = authorizationHandler;
        this._fetchConfigBuilder = fetchConfigBuilder;
    }

    get base(): string {
        return this._base;
    }

    get authorizationHandler(){
        return this._authorizationHandler;
    }

    private async getFetchConfig(formRequest?: boolean) : Promise<RequestInit | undefined> {
        if(this._fetchConfigBuilder) return await this._fetchConfigBuilder(formRequest);
        if(this._authorizationHandler) {
            return {
                headers: {
                    "Authorization": await this._authorizationHandler.handleODataClientAuthorization(),
                    "Content-Type": formRequest ? "multipart/form-data" : "application/json"
                }
            }
        }
        return undefined;
    }

    execute<T extends ODataResponse>(request : ODataRequest<T>) : Promise<T> {
        return new Promise<T>((resolve,reject)=>{
            let formRequest = request.body instanceof FormData || request.body instanceof BinaryBody;
            this.getFetchConfig(formRequest).then((config)=>{
                let url = this._base+request.url;

                if(request.headers != null) {
                    if(config.headers == null) config.headers = request.headers;
                    else config.headers = {...config.headers,...request.headers}
                }

                let body = undefined;
                if(request.method === ODataRequestMethod.POST) body = ODataClientUtil.processRequestBody(request)
                else if(request.method === ODataRequestMethod.PUT) body = ODataClientUtil.processRequestBody(request)
                else if(request.method === ODataRequestMethod.PATCH) body = ODataClientUtil.processRequestBody(request)

                fetch(url, {
                    ...config,
                    method: ODataRequestMethod.DELETE,
                    body: body
                }).then((response)=> {
                    if(response.status <= 201){
                        response.json()
                            .then((data)=>resolve(ODataClientUtil.processResponseBody(request, data)))
                            .catch(reject)
                    }else{
                        resolve({} as T);
                    }
                }).catch(reject)

            }).catch(reject)
        })
    }

    executeBatch(batch : ODataBatch) : Promise<ODataResponse[]>{
        return new Promise<any>((resolve,reject)=>{
            let body : any = {
                requests: batch.requests().map((request)=>({
                    id: request.id,
                    method: request.method,
                    url: request.url.substring(1),
                    headers: {
                        "content-type": "application/json"
                    },
                    body: request.body ? ODataClientUtil.processRequestBody(request) : undefined
                }))
            }
            this.getFetchConfig().then((config)=>{
                fetch(this._base+"/$batch",{...config, method: "POST", body: body})
                    .then((response)=>{
                        response.json()
                            .then((data)=>resolve(ODataClientUtil.processBatchResponse(batch,data)))
                            .catch(reject)
                    })
                    .catch(reject)
            }).catch(reject)
        })
    }
}