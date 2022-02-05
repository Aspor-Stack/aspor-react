import {DependencyList, useEffect, useState} from "react";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";
import ODataQueryable from "../../../libraries/odata/query/ODataQueryable";

export default function useOSFirstCollectionResult<S,T>(type : (new ()=>S) | (new (app : Application)=>S),query : (service : S)=>ODataQueryable<T>, deps?: DependencyList) : { loading: boolean, result: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [result, setResult] = useState<T|null>(null)
    const [error, setError] = useState<any>(null)

    let service = useService(type);

    useEffect(()=>{
        if(!deps && !loading) return
        query(service).getFirst()
            .then((result)=> setResult(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, result, error}
}
