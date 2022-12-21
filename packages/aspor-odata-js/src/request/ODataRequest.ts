import ODataRequestMethod from "./ODataRequestMethod";
import {ODataResponse} from "../response/ODataResponse";
import ODataRequestType from "./ODataRequestType";
import ODataClient from "../client/ODataClient";

export default class ODataRequest<T extends ODataResponse> {

    public readonly client: ODataClient;
    public readonly url: string;
    public readonly method: ODataRequestMethod;
    public readonly type: ODataRequestType;
    public readonly formatters: any;
    public readonly body?: any;

    private _id?: string
    private _headers?: any
    private _successHandler?: (data : any)=>void
    private _errorHandler?: (data : any)=>void

    constructor(client: ODataClient, url: string, method: ODataRequestMethod, type: ODataRequestType, formatters: any, body?: any) {
        this.client = client;
        this.url = url;
        this.method = method;
        this.type = type;
        this.formatters = formatters;
        this.body = body;
    }

    get id(){
        return this._id;
    }

    get headers(){
        return this._headers;
    }

    get successHandler(){
        return this._successHandler;
    }

    get errorHandler(){
        return this._errorHandler;
    }

    initialize(id: string, successHandler?: (data : any)=>void,errorHandler?: (data : any)=>void){
        if(this._id) throw new Error("request is already initialized")
        this._id = id;
        this._successHandler = successHandler;
        this._errorHandler = errorHandler;
    }

    withHeader(key: string, value: string){
        if(this._headers == null) this._headers = {}
        this._headers[key] = value;
        return this;
    }

    now(){
        return this.client.execute(this);
    }

    execute(){
        return this.client.execute(this);
    }
}

export class BinaryBody {

    files: any []
    formName?: string

    constructor(files: any[], formName?: string) {
        this.files = files;
        this.formName = formName;
    }

}

