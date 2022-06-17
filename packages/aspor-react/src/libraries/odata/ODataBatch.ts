import ODataRequest from "./request/ODataRequest";
import {ODataService} from "../../index";
import {ODataResponse} from "./response/ODataResponse";

export default class ODataBatch {

    private readonly _service : ODataService;
    private readonly _requests : ODataRequest<any>[];

    constructor(service : ODataService) {
        this._service = service;
        this._requests = [];
    }

    service(): ODataService {
        return this._service;
    }

    requests(): ODataRequest<any>[] {
        return this._requests;
    }

    addWithPromise<T extends ODataResponse>(request : ODataRequest<T>) : Promise<T> {
        return new Promise<T>((resolve, reject)=>{
            let id = "request-"+this._requests.length;
            request.initialize(id,resolve,reject)
            this._requests.push(request);
        })
    }

    add<T extends ODataResponse>(request : ODataRequest<T>) : string {
        let id = "request-"+this._requests.length;
        request.initialize(id)
        this._requests.push(request);
        return id;
    }

    commit(){
        this.execute();//No result required at this point
    }

    execute() : Promise<ODataResponse[]>{
        return this._service.client().executeBatch(this);
    }

}
