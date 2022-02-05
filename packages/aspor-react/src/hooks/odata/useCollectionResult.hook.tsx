import {useEffect, useState} from "react";
import {ODataQueryable} from "../../index";

export default function useCollectionResult<T>(query: ODataQueryable<T>, withCount: boolean) : { loading: boolean, result: T[], count: number, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [result, setResult] = useState<T[]|null>(null)
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        (withCount ? query.getManyWithCount() : query.getMany())
            .then((result)=> {
                setResult(result.rows)
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, [query,withCount]);

    return {loading, result, count, error}
}
