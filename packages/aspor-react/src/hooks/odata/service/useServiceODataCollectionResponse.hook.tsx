import {DependencyList, useEffect, useState} from "react";
import ODataRequest from "../../../libraries/odata/request/ODataRequest";
import ODataCollectionResponse from "../../../libraries/odata/response/ODataCollectionResponse";
import useService from "../../system/useService.hook";
import Application from "../../../system/Application";

export default function useServiceODataCollectionResponse<S,T>(type: (new ()=>S) | (new (app : Application)=>S), query: (service : S)=>ODataRequest<ODataCollectionResponse<T>>|undefined, deps?: DependencyList) : [T[],number,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const service = useService(type);

    const load = () => {
        let query0 = query(service);
        if(query0){
            setLoading(true)
            query0.now()
                .then((result)=> {
                    setRows(result.rows)
                    setCount(result.count)
                    setError(undefined)
                })
                .catch((error)=>setError(error))
                .finally(()=>setLoading(false))
        }
    }

    useEffect(load,deps);

    return [rows,count,loading,error,load]
}
