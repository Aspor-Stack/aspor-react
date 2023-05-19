import ODataClient, {IODataAuthorizationHandler} from "./ODataClient";
import axios, {AxiosRequestConfig} from "axios";
import JSONbig from "json-bigint";
import ODataResponse from "../response/ODataResponse";
import ODataRequest, {BinaryBody} from "../request/ODataRequest";
import ODataRequestMethod from "../request/ODataRequestMethod";
import ODataBatch from "../ODataBatch";
import ODataClientUtil from "./ODataClientUtil";

export default class AxiosODataClient implements ODataClient {

    private readonly _base: string | (() => string)
    private readonly _authorizationHandler? : IODataAuthorizationHandler
    private readonly _axiosConfigBuilder? : (formRequest?: boolean)=>Promise<AxiosRequestConfig>

    constructor(base: string | (() => string), authorizationHandler? : IODataAuthorizationHandler, axiosConfigBuilder? : (formRequest?: boolean)=>Promise<AxiosRequestConfig>) {
        this._base = base;
        this._authorizationHandler = authorizationHandler;
        this._axiosConfigBuilder = axiosConfigBuilder;
    }

    get base(): string {
        if(typeof this._base === 'string') return this._base;
        else return this._base()
    }

    get authorizationHandler(){
        return this._authorizationHandler;
    }

    private async getAxiosConfig(formRequest?: boolean) : Promise<AxiosRequestConfig | undefined> {
        if(this._axiosConfigBuilder) return await this._axiosConfigBuilder(formRequest);
        if(this._authorizationHandler) {
            return {
                headers: {
                    "Authorization": await this._authorizationHandler.handleODataClientAuthorization(),
                    "Content-Type": formRequest ? "multipart/form-data" : "application/json"
                },
                transformRequest: (req) => {
                    if(req instanceof FormData) return req;
                    return req ? JSONbig.stringify(req) : undefined
                },
                transformResponse: (res) => {
                    return res && res.length > 0 ? JSONbig.parse(res) : undefined
                }
            }
        }
        return undefined;
    }

    execute<T extends ODataResponse>(request : ODataRequest<T>) : Promise<T> {
        return new Promise<T>((resolve,reject)=>{
            let formRequest = request.body instanceof FormData || request.body instanceof BinaryBody;
            this.getAxiosConfig(formRequest).then((config)=>{
                let url = this.base+request.url;

                if(request.headers != null) {
                    if(config.headers == null) config.headers = request.headers;
                    else config.headers = {...config.headers,...request.headers}
                }

                let promise : Promise<any>;
                if(request.method === ODataRequestMethod.GET) promise = axios.get(url, config);
                else if(request.method === ODataRequestMethod.DELETE) promise = axios.delete(url, config);
                else if(request.method === ODataRequestMethod.POST) promise = axios.post(url, ODataClientUtil.processRequestBody(request),config);
                else if(request.method === ODataRequestMethod.PUT) promise = axios.put(url, ODataClientUtil.processRequestBody(request),config);
                else if(request.method === ODataRequestMethod.PATCH) promise = axios.patch(url, ODataClientUtil.processRequestBody(request),config);

                promise
                    .then((response)=>resolve(ODataClientUtil.processResponseBody(request,response.data)))
                    .catch(reject)

            }).catch(reject)
        })
    }

    executeBatch(batch : ODataBatch) : Promise<ODataResponse[]>{
        return new Promise<any>((resolve,reject)=>{
            let body = {
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
            this.getAxiosConfig().then((config)=>{
                axios.post(this.base+"/$batch",body,config)
                    .then((response)=>resolve(ODataClientUtil.processBatchResponse(batch,response.data)))
                    .catch(reject)
            }).catch(reject)
        })
    }
}