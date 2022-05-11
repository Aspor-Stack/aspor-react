import ODataResult from "./query/ODataResult";
import axios, {AxiosRequestConfig} from "axios";
import {IAuthenticationService} from "../../system/service/authentication/authentication.service";

export interface AuthorizationHandler {

    handleAuthorization() : Promise<string|undefined>

}

function instanceOfAuthorizationHandler(object: any): object is AuthorizationHandler {
    return 'handleAuthorization' in object;
}

export default class ODataClient {

    private readonly _authorizationHandler? : AuthorizationHandler

    constructor(authorizationHandler? : AuthorizationHandler | IAuthenticationService) {
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

    get authorizationHandler(){
        return this._authorizationHandler;
    }

    private async getAxiosConfig(contentType?: string) : Promise<AxiosRequestConfig | undefined> {
        if(this._authorizationHandler) {
            return {
                headers: {
                    "Authorization": await this._authorizationHandler.handleAuthorization(),
                    "Content-Type": contentType??"application/json"
                }
            }
        }
        return undefined;
    }

    get<E>(url : string) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            this.getAxiosConfig().then((config)=>{
                axios.get(url,config)
                    .then((response)=>resolve(response.data))
                    .catch(reject)
            }).catch(reject)
        })
    }

    getMany<E>(url : string) : Promise<ODataResult<E>> {
        return new Promise<ODataResult<E>>((resolve,reject)=>{
            this.getAxiosConfig().then((config)=>{
                axios.get(url,config)
                    .then((response)=>{
                        resolve({
                            count: response.data["@odata.count"],
                            rows: response.data.value as E[]
                        })
                    })
                    .catch(reject)
            }).catch(reject)
        })
    }

    post<E>(url : string, data : any) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            this.getAxiosConfig().then((config)=>{
                axios.post(url,data,config)
                    .then((response)=>resolve(response.data))
                    .catch(reject)
            }).catch(reject)
        })
    }

    patch<E>(url : string, delta : any) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            this.getAxiosConfig().then((config)=>{
                axios.patch(url,delta,config)
                    .then((response)=>resolve(response.data))
                    .catch(reject)
            }).catch(reject)
        })
    }

    put<E>(url : string, delta : any) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            this.getAxiosConfig().then((config)=>{
                axios.put(url,delta,config)
                    .then((response)=>resolve(response.data))
                    .catch(reject)
            }).catch(reject)
        })
    }

    delete<E>(url : string) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            this.getAxiosConfig().then((config)=>{
                axios.delete(url,config)
                    .then((response)=>resolve(response.data))
                    .catch(reject)
            }).catch(reject)
        })
    }

    postForm<E>(url : string, data : FormData) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            this.getAxiosConfig("multipart/form-data").then((config)=>{
                axios.post(url,data,config)
                    .then((response)=>resolve(response.data))
                    .catch(reject)
            }).catch(reject)
        })
    }

    postBinary<E>(url : string, files : File[] | Blob[], formName?: string) : Promise<E> {
        let data = new FormData();
        for(let file of files){
            data.append(formName??"file", file);
        }
        return this.postForm(url,data)
    }
}
