import {DependencyList, useEffect, useState} from "react";
import ODataRequest from "../../../libraries/odata/request/ODataRequest";
import ODataResponse from "../../../libraries/odata/response/ODataResponse";
import Application from "../../../system/Application";
import useService from "../../system/useService.hook";

export default function useServiceODataEntityResponse<S,T>(type:  (new ()=>S) | (new (app : Application)=>S), query: (service: S)=>ODataRequest<ODataResponse & T>, deps?: DependencyList) : [T|undefined,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [entity, setEntity] = useState<T>(undefined)
    const [error, setError] = useState<any>(null)

    const service = useService(type);

    const load = () => {
        setLoading(true)
        query(service).now()
            .then((result)=> {
                setEntity(result)
                setError(undefined)
            })
            .catch((error)=>setError(error))
            .finally(()=>setLoading(false))
    }

    useEffect(load,deps);

    return [entity,loading,error,load]
}
