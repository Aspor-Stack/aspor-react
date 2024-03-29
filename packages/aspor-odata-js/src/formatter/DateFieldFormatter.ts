import {ODataFieldFormatter} from "./ODataFieldFormatter";

class DateODataFieldFormatter implements ODataFieldFormatter{

    formatIncoming(input: any): any {
        if(input !== null){
            if(typeof input === "string"){
                return new Date(Date.parse(input))
            }else{
                throw new Error("Received invalid input type for json formatter")
            }
        }else{
            return input;
        }
    }

    formatOutgoing(input: any): any {
        if(input !== null){
            if(input instanceof Date){
                return input.toISOString();
            }else if(typeof input === "string"){
                return new Date(Date.parse(input)).toISOString()
            }else if(typeof input === "number"){
                return new Date(input).toISOString()
            }
            throw new Error("Received invalid input type for json formatter")
        }else{
            return input
        }
    }

}

const DateFieldFormatter : DateODataFieldFormatter = new DateODataFieldFormatter();
export default DateFieldFormatter;

