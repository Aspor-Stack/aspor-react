import {DependencyList, useEffect, useState} from "react";
import ODataRequest from "../../libraries/odata/request/ODataRequest";
import ODataResponse from "../../libraries/odata/response/ODataResponse";

export default function useODataEntityResponse<T>(query: ODataRequest<ODataResponse & T>, deps?: DependencyList) : [T|undefined,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [entity, setEntity] = useState<T>(undefined)
    const [error, setError] = useState<any>(null)

    const load = () => {
        setLoading(true)
        query.now()
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
