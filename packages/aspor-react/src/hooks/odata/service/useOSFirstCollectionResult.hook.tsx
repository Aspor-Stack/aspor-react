import {DependencyList, useEffect, useState} from "react";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";
import ODataQueryable from "../../../libraries/odata/query/ODataQueryable";

export default function useOSFirstCollectionResult<S,T>(type : (new ()=>S) | (new (app : Application)=>S),query : (service : S)=>ODataQueryable<T>, deps?: DependencyList) : { loading: boolean, row: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [row, setRow] = useState<T|undefined>()
    const [error, setError] = useState<any>(null)

    let service = useService(type);

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        query(service).getFirst().now()
            .then((result)=> setRow(result))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, row, error}
}
