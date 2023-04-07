import {ODataFieldFormatter} from "./ODataFieldFormatter";
import {Guid} from "../Guid";

class GuidODataFieldFormatter implements ODataFieldFormatter{

    formatIncoming(input: any): any {
        if(input !== null){
            if(typeof input === "string"){
                return Guid.new(input)
            }else{
                throw new Error("Received invalid input type for json formatter")
            }
        }else{
            return input;
        }
    }

    formatOutgoing(input: any): any {
        if(input !== null){
            if(input instanceof Guid){
                return input.toString()
            }
            throw new Error("Received invalid input type for json formatter")
        }else{
            return input;
        }
    }

}

const GuidFieldFormatter : GuidODataFieldFormatter = new GuidODataFieldFormatter();
export default GuidFieldFormatter;

