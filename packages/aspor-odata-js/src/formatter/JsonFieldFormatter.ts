import {ODataFieldFormatter} from "./ODataFieldFormatter";

class JsonODataFieldFormatter implements ODataFieldFormatter{


    formatIncoming(input: any): any {
        if(input){
            if(typeof input === "string"){
                return JSON.parse(input)
            }else{
                throw new Error("Received invalid input type for json formatter")
            }
        }else{
            return input;
        }
    }

    formatOutgoing(input: any): any {
        return input ? JSON.stringify(input) : input;
    }

}

const JsonFieldFormatter : JsonODataFieldFormatter = new JsonODataFieldFormatter();
export default JsonFieldFormatter;

