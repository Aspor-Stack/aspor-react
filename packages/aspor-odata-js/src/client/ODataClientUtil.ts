import ODataRequest, {BinaryBody} from "../request/ODataRequest";
import ODataRequestType from "../request/ODataRequestType";
import ODataErrorResponse from "../response/ODataErrorResponse";
import ODataBatch from "../ODataBatch";

export const ODataClientUtil = {
    processRequestBody: (request : ODataRequest<any>) : any|undefined => {
        if(request.body && !(request.body instanceof FormData)){
            if(request.body instanceof BinaryBody){
                let data = new FormData();
                for(let file of request.body.files){
                    data.append(request.body.formName??"file", file);
                }
                return data;
            }
            if(request.formatters) return ODataClientUtil.formatOutgoing(request.body,request.formatters)
        }
        return request.body;
    },
    processResponseBody: (request : ODataRequest<any>, body: any) : any|undefined => {
        if(body){
            if(request.type == ODataRequestType.COLLECTION){
                return {
                    context: body["@odata.context"],
                    count: body["@odata.count"],
                    rows: body.value?.map((row)=>ODataClientUtil.formatIncoming(row,request.formatters))??[]
                };
            }else  if(request.type == ODataRequestType.COLLECTION_COUNT){
                return {
                    context: body["@odata.context"],
                    count: body["@odata.count"],
                };
            }else if(request.type == ODataRequestType.COLLECTION_FIRST){
                let row = body.value?.length > 0 ? body.value[0] : undefined
                if(row) {
                    return {
                        context: body["@odata.context"],
                        ...ODataClientUtil.formatIncoming(row)
                    };
                }else {
                    return undefined;
                }
            }else if(request.type == ODataRequestType.ENTITY){
                return {
                    context: body["@odata.context"],
                    ...ODataClientUtil.formatIncoming(body,request.formatters)
                };
            }
        }else{
            return {
                context: "empty"
            };
        }
    },
    processBatchResponse : (batch : ODataBatch, data: any) => {
        return data.responses.map((response : any)=>{
            let request = batch.requests().find(r => r.id === response.id);
            if(!request) throw new Error("received invalid response");

            if(response.status >= 200 && response.status <= 220){
                let result = ODataClientUtil.processResponseBody(request,response.body)
                if(request.successHandler) ODataClientUtil.executePromiseHandlerAsync(request.successHandler,result);
                return result;
            }else{
                let error : any = new Error("Network Error");
                error.response = response;
                if(request.errorHandler) ODataClientUtil.executePromiseHandlerAsync(request.errorHandler,error);
                return {
                    error: error,
                    context: "error"
                } as ODataErrorResponse;
            }
        })
    },
    executePromiseHandlerAsync: async (method: (any)=>void, data: any) => {
        method(data)
    },
    formatIncoming: (row : any, formatters? : any) : any => {
        if(row && formatters){
            for(let key of Object.keys(formatters)){
                let value = row[key];
                if(value !== null) row[key] = formatters[key].formatIncoming(value);
            }
        }
        return row;
    },
    formatOutgoing: (row : any, formatters? : any) : any => {
        if(row && formatters){
            for(let key of Object.keys(formatters)){
                let value = row[key];
                if(value !== null) row[key] = formatters[key].formatOutgoing(value);
            }
        }
        return row;
    }
};

export default ODataClientUtil;