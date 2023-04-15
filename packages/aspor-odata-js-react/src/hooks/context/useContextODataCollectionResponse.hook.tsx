import {Context, DependencyList, useContext, useEffect, useState} from "react";
import {ODataRequest, ODataCollectionResponse} from "@aspor/aspor-odata-js"

export default function useContextODataCollectionResponse<C,T>(context: Context<C>, query: (service : C)=>ODataRequest<ODataCollectionResponse<T>>|undefined, deps?: DependencyList) : [T[],number,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const service = useContext<C>(context);

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
