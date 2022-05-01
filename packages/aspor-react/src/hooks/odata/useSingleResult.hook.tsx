import {DependencyList, useEffect, useState} from "react";
import ODataSingleQueryable from "../../libraries/odata/query/ODataSingleQueryable";

export default function useSingleResult<T>(query: ODataSingleQueryable<T>, deps?: DependencyList) : { loading: boolean, result: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [result, setResult] = useState<T|null>(null)
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        if(!deps && !loading) return;
        if(deps?.includes(undefined)) return;
        query.get()
            .then((result)=>setResult(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, result, error}
}
