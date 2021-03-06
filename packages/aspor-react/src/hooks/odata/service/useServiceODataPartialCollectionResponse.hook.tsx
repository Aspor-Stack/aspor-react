import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../../libraries/odata/query/ODataQueryable";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";

export default function useServiceODataPartialCollectionResponse<S,T>(type:  (new ()=>S) | (new (app : Application)=>S), query: (service : S)=>ODataQueryable<T>, stepCount: number, deps?: DependencyList) : [T[],number,boolean,any,()=>void,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [index, setIndex] = useState<number>(0)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    const service = useService(type);

    const loadNext = () => load(index + stepCount)
    const reload = () => load(0)

    const load = (index : number) => {
        setLoading(true)
        setIndex(index)
        let reset = index === 0;
        query(service).skip(index).top(stepCount)
            .getManyWithCount().now()
            .then((result)=> {
                setRows(rows => reset ? result.rows : [...rows,...result.rows])
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }

    useEffect(()=> load(0), deps);

    return [rows,count,loading,error,loadNext,reload]
}