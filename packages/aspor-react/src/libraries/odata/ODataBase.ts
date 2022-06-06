import ODataClient from "./ODataClient";

export default interface ODataBase {

    formatters?: any;

    client() : ODataClient

    url() : string

}

export abstract class AbstractODataBase implements ODataBase {

    protected readonly _base : ODataBase
    public formatters : any

    protected constructor(base : ODataBase) {
        this._base = base;
    }

    client() : ODataClient {
        return this._base.client();
    }

    abstract url() : string

}
