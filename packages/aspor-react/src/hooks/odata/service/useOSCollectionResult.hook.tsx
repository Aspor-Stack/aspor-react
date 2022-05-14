import {DependencyList, useEffect, useState} from "react";
import ODataQueryable from "../../../libraries/odata/query/ODataQueryable";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";

export default function useOSCollectionResult<S,T>(type : (new ()=>S) | (new (app : Application)=>S),query : (service : S)=>ODataQueryable<T>, withCount: boolean, deps?: DependencyList) : { loading: boolean, rows: T[], count: number, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [rows, setRows] = useState<T[]>([])
    const [count, setCount] = useState<number>(0)
    const [error, setError] = useState<any>(null)

    let service = useService(type);

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        setLoading(true);
        let query0 = query(service);
        (withCount ? query0.getManyWithCount() : query0.getMany())
            .then((result)=> {
                setRows(result.rows)
                setCount(result.count)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, rows, count, error}
}
