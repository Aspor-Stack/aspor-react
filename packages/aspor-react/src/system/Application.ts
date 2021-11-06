import AsporUser from "./service/authentication/AsporUser";
import ServiceDefinition from "./service/ServiceDefinition";

export default interface Application {

    initialize(services: any) : void

    get isReady() : boolean

    set ready(ready : boolean)

    get user() : AsporUser

    get isAuthenticated() : boolean

    service<S>(type: ServiceDefinition<S>) : S
    service<S>(type: new () => S) : S
    service<S>(type: string) : S

    reload() : void

    subscribe(handler : ()=>void): void

    unsubscribe(handler : ()=>void): void
}
