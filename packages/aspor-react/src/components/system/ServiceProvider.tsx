import ServiceDefinition from "../../system/service/ServiceDefinition";
import AsporComponent from "../AsporComponent";
import Application from "../../system/Application";

export type ServiceProviderProps<S> = {
    service: ServiceDefinition<S> | (new ()=>S) | (new (app : Application)=>S) | string,
    render: (service : S)=>any
}

export type ServiceProviderState = {}


export default class ServiceProvider<S> extends AsporComponent<ServiceProviderProps<S>,ServiceProviderState> {

    render(){
       return this.props.render(this.app.service<S>(this.props.service));
    }

}
