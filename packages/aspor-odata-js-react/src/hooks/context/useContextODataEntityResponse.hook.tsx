import {Context, DependencyList, useContext, useEffect, useState} from "react";
import {ODataRequest, ODataResponse} from "@aspor/aspor-odata-js"

export default function useContextODataEntityResponse<C,T>(context:  Context<C>, query: (service: C)=>ODataRequest<ODataResponse & T>|undefined, deps?: DependencyList) : [T|undefined,boolean,any,()=>void] {
    const [loading, setLoading] = useState<boolean>(true)
    const [entity, setEntity] = useState<T>(undefined)
    const [error, setError] = useState<any>(null)

    const service = useContext<C>(context);

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
