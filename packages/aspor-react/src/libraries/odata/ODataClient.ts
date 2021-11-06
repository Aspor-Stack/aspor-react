import {ODataResult} from "./query/ODataResult";
import axios, {AxiosRequestConfig} from "axios";

export interface AuthorizationHandler {

    handleAuthorization() : string

}

export class ODataClient {

    private readonly _authorizationHandler? : AuthorizationHandler

    constructor(authorizationHandler? : AuthorizationHandler) {
        this._authorizationHandler = authorizationHandler;
    }

    get authorizationHandler(){
        return this._authorizationHandler;
    }

    private getAxiosConfig() : AxiosRequestConfig | undefined {
        if(this._authorizationHandler) {
            return {
                headers: {
                    "Authorization": this._authorizationHandler.handleAuthorization()
                }
            }
        }
        return undefined;
    }

    get<E>(url : string) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            axios.get(url,this.getAxiosConfig())
                .then((response)=>resolve(response.data))
                .catch(reject)
        })
    }

    getMany<E>(url : string) : Promise<ODataResult<E>> {
        return new Promise<ODataResult<E>>((resolve,reject)=>{
            axios.get(url,this.getAxiosConfig())
                .then((response)=>{
                    resolve({
                        count: response.data["@odata.count"],
                        rows: response.data.value as E[]
                    })
                })
                .catch(reject)
        })
    }

    post<E>(url : string, data : any) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            axios.post(url,data,this.getAxiosConfig())
                .then((response)=>resolve(response.data))
                .catch(reject)
        })
    }

    patch<E>(url : string, delta : any) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            axios.patch(url,delta,this.getAxiosConfig())
                .then((response)=>resolve(response.data))
                .catch(reject)
        })
    }

    put<E>(url : string, delta : any) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            axios.put(url,delta,this.getAxiosConfig())
                .then((response)=>resolve(response.data))
                .catch(reject)
        })
    }

    delete<E>(url : string) : Promise<E> {
        return new Promise<E>((resolve,reject)=>{
            axios.delete(url,this.getAxiosConfig())
                .then((response)=>resolve(response.data))
                .catch(reject)
        })
    }
}
