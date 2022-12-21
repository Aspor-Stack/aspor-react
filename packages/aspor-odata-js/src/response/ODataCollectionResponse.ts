import {ODataResponse} from "./ODataResponse";

export type ODataCollectionResponse<Entity>  = ODataResponse & {

    rows: Entity[]

    count: number

}

export default ODataCollectionResponse;

function isCollectionResponse<Entity>(object: ODataCollectionResponse<Entity>): object is ODataCollectionResponse<Entity> {
    return 'rows' in object;
}
