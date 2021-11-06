import ODataBase from "./ODataBase";
import ODataClient from "./ODataClient";


export default class ODataService implements ODataBase{

    private readonly _client : ODataClient
    private readonly _base : string

    constructor(client : ODataClient,base : string) {
        this._client = client;
        this._base = base;
    }

    client(): ODataClient {
        return this._client;
    }

    url(): string {
        return this._base;
    }

    base() {
        return this._base;
    }

    document() {

    }

    metadata(){

    }

}
