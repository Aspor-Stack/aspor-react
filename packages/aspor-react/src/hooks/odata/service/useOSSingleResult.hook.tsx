import {DependencyList, useEffect, useState} from "react";
import ODataSingleQueryable from "../../../libraries/odata/query/ODataSingleQueryable";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";

export default function useOSSingleResult<S,T>(type : (new ()=>S) | (new (app : Application)=>S),query : (service : S)=>ODataSingleQueryable<T>, deps?: DependencyList) : { loading: boolean, result: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [result, setResult] = useState<T|null>(null)
    const [error, setError] = useState<any>(null)

    let service = useService(type);

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        query(service).get()
            .then((result)=>setResult(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, result, error}
}
