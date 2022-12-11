import axios, {AxiosRequestConfig} from "axios";
import {IAuthenticationService} from "../../system/service/authentication/authentication.service";
import ODataRequest, {BinaryBody} from "./request/ODataRequest";
import ODataBatch from "./ODataBatch";
import {ODataResponse} from "./response/ODataResponse";
import ODataRequestMethod from "./request/ODataRequestMethod";
import ODataRequestType from "./request/ODataRequestType";
import {ODataErrorResponse} from "./response/ODataErrorResponse";
import JSONbig from 'json-bigint';

export interface AuthorizationHandler {

    handleAuthorization() : Promise<string|undefined>

}

function instanceOfAuthorizationHandler(object: any): object is AuthorizationHandler {
    return object && 'handleAuthorization' in object;
}

export default class ODataClient {

    private readonly _base : string
    private readonly _authorizationHandler? : AuthorizationHandler

    constructor(base : string, authorizationHandler? : AuthorizationHandler | IAuthenticationService) {
        this._base = base;
        if(authorizationHandler){
            if(instanceOfAuthorizationHandler(authorizationHandler)){
                this._authorizationHandler = authorizationHandler;
            }else{
                this._authorizationHandler = new class implements AuthorizationHandler {
                    handleAuthorization(): Promise<string|undefined> {
                        if(authorizationHandler.isAuthenticated()) return authorizationHandler.acquireAuthorizationHeader()
                        else return undefined;
                    }
                }
            }
        }
    }

    get base(){
        return this._base;
    }

    get authorizationHandler(){
        return this._authorizationHandler;
    }

    private async getAxiosConfig(formRequest?: boolean) : Promise<AxiosRequestConfig | undefined> {
        if(this._authorizationHandler) {
            return {
                headers: {
                    "Authorization": await this._authorizationHandler.handleAuthorization(),
                    "Content-Type": formRequest ? "multipart/form-data" : "application/json"
                },
                transformRequest: (req) => {
                    return JSONbig.stringify(req)
                },
                transformResponse: (res) => {
                    return JSONbig.parse(res)
                }
            }
        }
        return undefined;
    }

    execute<T extends ODataResponse>(request : ODataRequest<T>) : Promise<T> {
        return new Promise<T>((resolve,reject)=>{
            let formRequest = request.body instanceof FormData || request.body instanceof BinaryBody;
            this.getAxiosConfig(formRequest).then((config)=>{
                let url = this._base+request.url;

                if(request.headers != null) {
                    if(config.headers == null) config.headers = request.headers;
                    else config.headers = {...config.headers,...request.headers}
                }

                let promise : Promise<any>;
                if(request.method === ODataRequestMethod.GET) promise = axios.get(url,config);
                else if(request.method === ODataRequestMethod.DELETE) promise = axios.delete(url,config);
                else if(request.method === ODataRequestMethod.POST) promise = axios.post(url,ODataClient.processRequestBody(request),config);
                else if(request.method === ODataRequestMethod.PUT) promise = axios.put(url,ODataClient.processRequestBody(request),config);
                else if(request.method === ODataRequestMethod.PATCH) promise = axios.patch(url,ODataClient.processRequestBody(request),config);

                promise
                    .then((response)=>resolve(ODataClient.processResponseBody(request,response.data)))
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
                    body: request.body ? ODataClient.processRequestBody(request) : undefined
                }))
            }
            this.getAxiosConfig().then((config)=>{
                axios.post(this._base+"/$batch",body,config)
                    .then((response)=>{
                        resolve(response.data.responses.map((response : any)=>{
                            let request = batch.requests().find(r => r.id === response.id);
                            if(!request) reject(new Error("received invalid response"));

                            if(response.status >= 200 && response.status <= 220){
                                let result = ODataClient.processResponseBody(request,response.body)
                                if(request.successHandler) this.executePromiseHandlerAsync(request.successHandler,result);
                                return result;
                            }else{
                                let error : any = new Error("Network Error");
                                error.response = response;
                                if(request.errorHandler) this.executePromiseHandlerAsync(request.errorHandler,error);
                                return {
                                    error: error,
                                    context: "error"
                                } as ODataErrorResponse;
                            }
                        }))
                    })
                    .catch(reject)
            }).catch(reject)
        })
    }

    async executePromiseHandlerAsync(method: (any)=>void, data: any){
        method(data)
    }

    private static processRequestBody(request : ODataRequest<any>) : any|undefined {
        if(request.body && !(request.body instanceof FormData)){
            if(request.body instanceof BinaryBody){
                let data = new FormData();
                for(let file of request.body.files){
                    data.append(request.body.formName??"file", file);
                }
                return data;
            }
            if(request.formatters) return this.formatOutgoing(request.body,request.formatters)
        }
        return request.body;
    }

    private static processResponseBody(request : ODataRequest<any>, body: any) : any|undefined {
        if(body){
            if(request.type == ODataRequestType.COLLECTION){
                return {
                    context: body["@odata.context"],
                    count: body["@odata.count"],
                    rows: body.value?.map((row)=>this.formatIncoming(row,request.formatters))??[]
                };
            }else  if(request.type == ODataRequestType.COLLECTION_COUNT){
                return {
                    context: body["@odata.context"],
                    count: body["@odata.count"],
                };
            }else if(request.type == ODataRequestType.COLLECTION_FIRST){
                let row = body.value?.length > 0 ? body.value[0] : undefined
                if(row) {
                    return {
                        context: body["@odata.context"],
                        ...this.formatIncoming(row)
                    };
                }else {
                    return undefined;
                }
            }else if(request.type == ODataRequestType.ENTITY){
                return {
                    context: body["@odata.context"],
                    ...this.formatIncoming(body,request.formatters)
                };
            }
        }else{
            return {
                context: "empty"
            };
        }
    }

    private static formatIncoming(row : any, formatters? : any) : any{
        if(row && formatters){
            for(let key of Object.keys(formatters)){
                let value = row[key];
                if(value !== null) row[key] = formatters[key].formatIncoming(value);
            }
        }
        return row;
    }

    private static formatOutgoing(row : any, formatters? : any) : any{
        if(row && formatters){
            for(let key of Object.keys(formatters)){
                let value = row[key];
                if(value !== null) row[key] = formatters[key].formatOutgoing(value);
            }
        }
        return row;
    }

}
