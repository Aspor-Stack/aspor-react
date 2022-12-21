import {ODataResponse} from "./ODataResponse";


export type ODataErrorResponse = ODataResponse & {

    error: Error,

    context : string

}

export default ODataErrorResponse;

