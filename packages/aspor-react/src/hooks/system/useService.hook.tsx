import {useContext} from "react";
import {ApplicationContext} from "../../components/system/AsporApplication";
import ServiceDefinition from "../../system/service/ServiceDefinition";
import Application from "../../system/Application";

export default function useService<S>(type: ServiceDefinition<S> | (new ()=>S) | (new (app : Application)=>S) | string | Function) : S {
    return useContext(ApplicationContext).service(type);
}
