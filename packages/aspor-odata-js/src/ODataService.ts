import ODataBase from "./ODataBase";
import ODataClient from "./ODataClient";
import ODataBatch from "./ODataBatch";

export default class ODataService implements ODataBase{

    private readonly _client : ODataClient

    constructor(client : ODataClient) {
        this._client = client;
    }

    client(): ODataClient {
        return this._client;
    }

    url(): string {
        return "";
    }

    startBatch() : ODataBatch {
        return new ODataBatch(this);
    }

}
