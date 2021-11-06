import ServiceDefinition from "../../system/service/ServiceDefinition";
import AsporComponent from "../AsporComponent";

export type ServiceProviderProps<S> = {
    type?: new () => S,
    name?: string,
    definition?: ServiceDefinition<S>
    render: (service : S)=>any
}

export type ServiceProviderState = {}


export default class ServiceProvider<S> extends AsporComponent<ServiceProviderProps<S>,ServiceProviderState> {

    render(){
        if(this.props.definition) return this.props.render(this.app.service<S>(this.props.definition));
        else if(this.props.name) return this.props.render(this.app.service<S>(this.props.name));
        else if(this.props.type) return this.props.render(this.app.service<S>(this.props.type));
    }

}
