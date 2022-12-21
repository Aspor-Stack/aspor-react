import {DependencyList, useEffect, useState} from "react";
import Application from "../../Application";
import useService from "../useService.hook";
import {ODataRequest, ODataResponse} from "@aspor/aspor-odata-js"

export default function useServiceODataEntityResponse<S,T>(type:  (new ()=>S) | (new (app : Application)=>S), query: (service: S)=>ODataRequest<ODataResponse & T>|undefined, deps?: DependencyList) : [T|undefined,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [entity, setEntity] = useState<T>(undefined)
    const [error, setError] = useState<any>(null)

    const service = useService(type);

    const load = () => {
        let query0 = query(service);
        if(query0){
            setLoading(true)
            query0.now()
                .then((result)=> {
                    setEntity(result)
                    setError(undefined)
                })
                .catch((error)=>setError(error))
                .finally(()=>setLoading(false))
        }
    }

    useEffect(load,deps);

    return [entity,loading,error,load]
}
