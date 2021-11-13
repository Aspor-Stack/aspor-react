import ServiceDefinition from "./service/ServiceDefinition";
import AsporUser from "./service/authentication/AsporUser";
import AuthenticationService from "./service/authentication/authentication.service";

export default class Application {

    private readonly _services : any = {};
    private readonly _subscriptions : any[] = [];
    private _ready : boolean = false;

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

    service<S>(type: ServiceDefinition<S> | (new ()=>S) | (new (app : Application)=>S) | string): S {
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

    service2<S>(type: ServiceDefinition<S> | (new ()=>S) | (new (app : Application)=>S)): S {
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

    service3<S>(type: (new (app : Application)=>S)): S {
        let name;
        if(typeof type === "string"){
            name = type;
        }else if(typeof type === "function"){
            name = type.name;
        }else{
            throw new Error("Invalid service type");
        }
        let service = this._services[name];
        if(service === null) throw new Error("Service "+name+" is not available");
        return service;
    }

    registerService<S, I extends S>(type: ServiceDefinition<S> | (new ()=>S) | (new (app : Application)=>S) | string | S, implType? : (new ()=>S) | (new (app : Application)=>S) | I): void {
        let name = null;
        let instance = null;

        if(type instanceof ServiceDefinition){
            name = type.name;
            if(!implType) throw new Error("Service definition requires a service implementation");
        }else if(type instanceof Function){
            name = type.constructor.name
            if(!implType){
                if(implType.constructor.arguments.length > 0){
                    instance = Reflect.construct(type,[this]);
                }else{
                    instance = Reflect.construct(type,[]);
                }
            }
        }else if(typeof type === "string"){
            name = type;
            if(!implType) throw new Error("Service definition requires a service implementation");
        }else{
            name = type.constructor.name;
            instance = type;
        }

        if(implType){
            if(implType instanceof Function){
                if(implType.constructor.arguments.length > 0){
                    instance = Reflect.construct(implType,[this]);
                }else{
                    instance = Reflect.construct(implType,[]);
                }
            }else {
                instance = implType;
            }
        }

        if(instance == null || name == null) throw new Error("Invalid service configuration");

        this._services[name] = instance;
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

    static new() : Application {
        return new Application();
    }
}
