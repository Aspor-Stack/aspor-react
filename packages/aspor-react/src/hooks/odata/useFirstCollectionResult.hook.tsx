import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export default function useFirstCollectionResult<T>(query: ODataQueryable<T>, deps?: DependencyList) : { loading: boolean, row?: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [row, setRow] = useState<T>()
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        query.getFirst()
            .then((result)=> setRow(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, row, error}
}
