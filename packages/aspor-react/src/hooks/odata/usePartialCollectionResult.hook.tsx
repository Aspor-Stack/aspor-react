import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export default function usePartialCollectionResult<S,T>(query: ODataQueryable<T>, withCount: boolean, loadSteps: number, deps?: DependencyList) : { loading: boolean, rows: T[], count: number, error: any, next: ()=>void } {
    const [loading, setLoading] = useState<boolean>(true)
    const [loadIndex, setLoadIndex] = useState<number>(0)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const loadNext = () => setLoadIndex(i => i+loadSteps)

    const load = () => {
        let reset = loadIndex === 0;
        (withCount ? query.getManyWithCount().now() : query.getMany().now())
            .then((result)=> {
                setRows(rows => reset ? result.rows : [...rows,...result.rows])
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }

    useEffect(()=>{
        load()
    }, [loadIndex]);

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        setLoadIndex(0)
        load()
    }, deps);

    return {loading, rows, count, error, next: loadNext}
}
