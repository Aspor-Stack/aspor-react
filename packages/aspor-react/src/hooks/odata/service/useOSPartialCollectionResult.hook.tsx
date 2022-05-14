import {DependencyList, useEffect, useState} from "react";
import Application from "../../../system/Application";
import ODataQueryable from "../../../libraries/odata/query/ODataQueryable";
import useService from "../../system/useService.hook";

export default function useOSPartialCollectionResult<S,T>(type : (new ()=>S) | (new (app : Application)=>S),query : (service : S)=>ODataQueryable<T>, withCount: boolean, loadSteps: number, deps?: DependencyList) : { loading: boolean, rows: T[], count: number, error: any, next: ()=>void } {
    const [loading, setLoading] = useState<boolean>(true)
    const [loadIndex, setLoadIndex] = useState<number>(0)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    let service = useService(type);

    const loadNext = () => setLoadIndex(i => i+loadSteps)

    useEffect(()=>{
        let reset = loadIndex === 0;
        let query0 = query(service).skip(loadIndex).top(loadSteps);
        (withCount ? query0.getManyWithCount() : query0.getMany())
            .then((result)=> {
                setRows(rows => reset ? result.rows : [...rows,...result.rows])
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, [loadIndex]);

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        setLoadIndex(0)
    }, deps);

    return {loading, rows, count, error, next: loadNext}
}
