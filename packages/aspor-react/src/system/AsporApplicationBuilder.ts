import Application from "./Application";
import ServiceDefinition from "./service/ServiceDefinition";
import SimpleApplication from "./SimpleApplication";

export default class AsporApplicationBuilder<T extends Application = SimpleApplication> {

    private readonly _type?: new ()=>T
    private readonly _services : any;

    constructor(type?: new ()=>T) {
        this._type = type;
        this._services = {}
    }

    registerService<S>(type: new ()=>S): void
    registerService<S,I extends S>(type: new ()=>S, implType: new ()=>I): void
    registerService<S,I extends S>(type: new ()=>S, service : I): void

    registerService<S,I extends S>(type: ServiceDefinition<S>, implType: new ()=>I): void
    registerService<S,I extends S>(type: ServiceDefinition<S>, service : I): void

    registerService(service : any): void
    registerService(paramOne: any,paramTwo?: any) : void {
        let name = null;
        let instance = null;
        if(typeof paramOne === "function"){
            name = paramOne.name;
            if(paramTwo){
                if(typeof paramTwo === "function"){
                    instance = new paramTwo();
                }else{
                    instance = paramTwo;
                }
            }else{
                instance = new paramOne();
            }
        }else if(paramOne instanceof ServiceDefinition){
            name = paramOne.name;
            if(typeof paramTwo === "function"){
                instance = new paramTwo();
            }else{
                instance = paramTwo;
            }
        }else if(paramOne.constructor){
            name = paramOne.constructor.name;
            instance = paramOne
        }

        if(instance == null || name == null) throw new Error("Invalid service");

        this._services[name] = instance;
    }

    build() : T {
        let instance : T
        if(this._type) return new this._type();
        else instance = new SimpleApplication() as unknown as T;
        instance.initialize(this._services);
        return instance;
    }

    static new() : AsporApplicationBuilder<Application>
    static new<T extends Application>(type: new ()=>T) : AsporApplicationBuilder<Application>
    static new<T extends Application>(type?: new ()=>T) : any {
        if(type) return new AsporApplicationBuilder<T>();
        else return new AsporApplicationBuilder();
    }
}
