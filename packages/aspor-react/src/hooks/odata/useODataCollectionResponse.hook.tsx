import {DependencyList, useEffect, useState} from "react";
import ODataRequest from "../../libraries/odata/request/ODataRequest";
import ODataCollectionResponse from "../../libraries/odata/response/ODataCollectionResponse";

export default function useODataCollectionResponse<T>(query: ODataRequest<ODataCollectionResponse<T>>, deps?: DependencyList) : [T[],number,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const load = () => {
        setLoading(true)
        query.now()
            .then((result)=> {
                setRows(result.rows)
                setCount(result.count)
                setError(undefined)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }

    useEffect(load,deps);

    return [rows,count,loading,error,load]
}
