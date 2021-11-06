import {Application} from "./Application";
import ServiceDefinition from "./service/ServiceDefinition";
import {AsporUser} from "./service/authentication/AsporUser";
import {AuthenticationService} from "./service/authentication/authoriaztion.service";

export class SimpleApplication implements Application {

    private readonly _subscriptions : any[] = [];
    private _services : any;
    private _ready : boolean = false;


    initialize(services: any): void {
        if(this._services != null) throw new Error("Application already initialized")
        this._services = services;
    }

    get user(): AsporUser {
        return this.service(AuthenticationService).getUser();
    }

    get isAuthenticated(): boolean {
        return this.service(AuthenticationService).isAuthenticated();
    }

    get isReady(): boolean {
        return this._ready;
    }

    set ready(ready: boolean) {
        this._ready = ready;
    }

    reload(): void {
        for (let subscription of this._subscriptions) {
            subscription();
        }
    }

    subscribe(handler: () => void): void {
        this._subscriptions.push(handler);
    }

    unsubscribe(handler: () => void): void {
        let index = this._subscriptions.indexOf(handler);
        this._subscriptions.splice(index,1);
    }

    service<S>(type: ServiceDefinition<S>): S;
    service<S>(type: { new(): S }): S;
    service<S>(type: string): S;
    service<S>(type : any): S {
        let name;
        if(typeof type === "string"){
            name = type;
        }else if(typeof type === "function"){
            name = type.name;
        }else if(type instanceof ServiceDefinition) {
            name = type.name;
        }else{
            throw new Error("Invalid service type");
        }
        let service = this._services[name];
        if(service === null) throw new Error("Service "+name+" is not available");
        return service;
    }

}
