import ODataClient from "./ODataClient";

export default interface ODataBase {

    client() : ODataClient

    url() : string

}

export abstract class AbstractODataBase implements ODataBase {

    protected readonly _base : ODataBase

    protected constructor(base : ODataBase) {
        this._base = base;
    }

    client() : ODataClient {
        return this._base.client();
    }

    abstract url() : string

}
