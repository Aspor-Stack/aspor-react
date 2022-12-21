import {DependencyList, useEffect, useState} from "react";
import {ODataRequest, ODataCollectionResponse} from "@aspor/aspor-odata-js"

export default function useODataCollectionResponse<T>(query: ODataRequest<ODataCollectionResponse<T>>|undefined, deps?: DependencyList) : [T[],number,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const load = () => {
        if(query){
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
    }

    useEffect(load,deps);

    return [rows,count,loading,error,load]
}
