import {useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import ServiceDefinition from "../../system/service/ServiceDefinition";

export function useService<S>(type: new () => S) : S {
    return useContext(ApplicationContext).service(type);
}

export function useNamedService<S>(type: string) : S {
    return useContext(ApplicationContext).service(type);
}

export function useDefinedService<S>(type: ServiceDefinition<S>) : S {
    return useContext(ApplicationContext).service(type);
}
