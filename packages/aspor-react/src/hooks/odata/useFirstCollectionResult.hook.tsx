import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export default function useFirstCollectionResult<T>(query: ODataQueryable<T>, deps?: DependencyList) : { loading: boolean, result: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [result, setResult] = useState<T|null>(null)
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        query.getFirst()
            .then((result)=> setResult(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, result, error}
}
