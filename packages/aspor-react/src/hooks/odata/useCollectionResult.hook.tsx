import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export default function useCollectionResult<T>(query: ODataQueryable<T>, withCount: boolean, deps?: DependencyList) : { loading: boolean, rows: T[], count: number, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        (withCount ? query.getManyWithCount() : query.getMany())
            .then((result)=> {
                setRows(result.rows)
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, rows, count, error}
}
