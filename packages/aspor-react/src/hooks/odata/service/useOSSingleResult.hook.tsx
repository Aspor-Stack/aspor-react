import {DependencyList, useEffect, useState} from "react";
import ODataSingleQueryable from "../../../libraries/odata/query/ODataSingleQueryable";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";

export default function useOSSingleResult<S,T>(type : (new ()=>S) | (new (app : Application)=>S),query : (service : S)=>ODataSingleQueryable<T>, deps?: DependencyList) : { loading: boolean, row?: T, error: any } {
    const [loading, setLoading] = useState<boolean>(true)
    const [row, setRow] = useState<T|undefined>()
    const [error, setError] = useState<any>(null)

    let service = useService(type);

    useEffect(()=>{
        if(!deps && !loading) return
        if(deps?.includes(undefined)) return;
        query(service).get().now()
            .then((rows)=>setRow(rows))
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }, deps);

    return {loading, row, error}
}
