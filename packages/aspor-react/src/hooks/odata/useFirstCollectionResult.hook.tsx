import {useEffect, useState} from "react";
import {ODataQueryable} from "../../index";

export default function useFirstCollectionResult<T>(query: ODataQueryable<T>) : { loading: boolean, result: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [result, setResult] = useState<T|null>(null)
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        query.getFirst()
            .then((result)=> setResult(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, [loading,result,error]);

    return {loading, result, error}
}
