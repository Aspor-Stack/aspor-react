import {useContext} from "react";
import {ApplicationContext} from "../components/AsporApplication";
import ServiceDefinition from "../service/ServiceDefinition";
import Application from "../Application";

export default function useService<S>(type: ServiceDefinition<S> | (new ()=>S) | (new (app : Application)=>S) | string | Function) : S {
    return useContext(ApplicationContext).service(type);
}
