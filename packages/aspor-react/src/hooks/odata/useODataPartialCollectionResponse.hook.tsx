import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../libraries/odata/query/ODataQueryable";

export default function useODataPartialCollectionResponse<T>(query: ODataQueryable<T>, stepCount: number, deps?: DependencyList) : [T[],number,boolean,any,()=>void,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [index, setIndex] = useState<number>(0)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const loadNext = () => setIndex(index => index + stepCount)
    const reload = () => setIndex(0)

    const load = () => {
        setLoading(true)
        let reset = index === 0;
        query.skip(index).top(stepCount)
            .getManyWithCount().now()
            .then((result)=> {
                setRows(rows => reset ? result.rows : [...rows,...result.rows])
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }

    useEffect(()=>{
        if(index !== 0) setIndex(0)
    }, deps);

    useEffect(load,[index])

    return [rows,count,loading,error,loadNext,reload]
}