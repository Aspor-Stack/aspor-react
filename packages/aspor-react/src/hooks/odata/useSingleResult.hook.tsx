import {DependencyList, useEffect, useState} from "react";
import ODataSingleQueryable from "../../libraries/odata/query/ODataSingleQueryable";

export default function useSingleResult<T>(query: ODataSingleQueryable<T>, deps?: DependencyList) : { loading: boolean, row?: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [row, setRow] = useState<T>()
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        if(!deps && !loading) return;
        if(deps?.includes(undefined)) return;
        query.get()
            .then((result)=>setRow(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, row, error}
}
