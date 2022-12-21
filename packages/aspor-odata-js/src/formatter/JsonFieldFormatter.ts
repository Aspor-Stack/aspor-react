import {ODataFieldFormatter} from "./ODataFieldFormatter";

class JsonODataFieldFormatter implements ODataFieldFormatter{


    formatIncoming(input: any): any {
        if(typeof input === "string"){
            return JSON.parse(input)
        }else{
            throw new Error("Received invalid input type for json formatter")
        }
    }

    formatOutgoing(input: any): any {
        return JSON.stringify(input);
    }

}

const JsonFieldFormatter : JsonODataFieldFormatter = new JsonODataFieldFormatter();
export default JsonFieldFormatter;

