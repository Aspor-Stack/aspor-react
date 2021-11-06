import {AbstractODataBase, ODataBase} from "../ODataBase";
import {ODataQueryUtility} from "./ODataQueryUtility";
import {Expression} from "./expression/Expression";
import {ExpressionOperator} from "./expression/ExpressionOperator";
import {ProjectorType} from "./expression/proxy/ProxyFilterTypes";
import {FieldReference} from "./expression/field/FieldReference";
import {FieldsFor} from "./expression/field/FieldsForType";
import {ODataQueryable} from "./ODataQueryable";
import {ODataQuerySegments} from "./ODataQuerySegments";
import {ODataExpressionVisitor} from "./expression/ODataExpressionVisitor";
import {Tracked} from "../tracked/Tracked";

export class ODataSingleQueryable<Entity, UEntity = Entity> extends AbstractODataBase{

    protected readonly _id : any
    protected readonly _name? : string
    protected readonly _expression?: Expression

    constructor(base : ODataBase,id : string,name? : string  | undefined,expression?: Expression) {
        super(base)
        this._id = id;
        this._name = name;
        this._expression = expression;
    }

    url() : string {
        if(this._name) return this._base.url()+"/"+this._name+"/"+this._id;
        else return this._base.url()+"/"+this._id;
    }

    public select<U extends FieldsFor<Entity>>(...fields: U[]): ODataSingleQueryable<Entity, U>;
    public select<U extends ProjectorType>(projector: (proxy: Entity) => U): ODataSingleQueryable<Entity, U>;
    public select<U>(...args: [(proxy: Entity) => U | FieldsFor<Entity>, ...FieldsFor<Entity>[]]) {
        if (args.length === 0) throw new Error('Parameters are required');

        const firstArg = args[0];
        if (typeof firstArg === "function") {
            const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
            firstArg(proxy as unknown as Entity);
            const expression = new Expression(ExpressionOperator.Select, [firstArg, ...ODataQueryUtility.getUsedPropertyPaths(proxy)], this._expression);
            return new ODataSingleQueryable<Entity,U>(this,this._id,this._name,expression);
        }

        const expression = new Expression(ExpressionOperator.Select, (args as FieldsFor<Entity>[]).map(v => new FieldReference<Entity>(v)), this._expression);
        return new ODataSingleQueryable<Entity,U>(this,this._id,this._name,expression);
    }

    public expandMany<K>(projector: (proxy: Entity) => K[],subQuery? : (query : ODataQueryable<K>)=>void): ODataSingleQueryable<Entity, UEntity> {
        let query = undefined;
        if(subQuery) query = subQuery(new ODataQueryable<K>(this));

        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        projector(proxy as unknown as Entity);
        const expression = new Expression(ExpressionOperator.Expand, [query,[...ODataQueryUtility.getUsedPropertyPaths(proxy)]], this._expression);
        return new ODataSingleQueryable<Entity,UEntity>(this,this._id,this._name,expression);
    }

    public expand<K>(projector: (proxy: Entity) => K,subQuery? : (query : ODataQueryable<K>)=>void): ODataSingleQueryable<Entity, UEntity> {
        let query = undefined;
        if(subQuery) query = subQuery(new ODataQueryable<K>(this));

        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        projector(proxy as unknown as Entity);
        const expression = new Expression(ExpressionOperator.Expand, [query,[...ODataQueryUtility.getUsedPropertyPaths(proxy)]], this._expression);
        return new ODataSingleQueryable<Entity,UEntity>(this,this._id,this._name,expression);
    }

    public expandAll() {
        const expression = new Expression(ExpressionOperator.ExpandAll, [], this._expression);
        return new ODataSingleQueryable<Entity,UEntity>(this,this._id,this._name,expression);
    }

    get() : Promise<Entity> {
        if(this._expression){
            let query : ODataQuerySegments = {}
            ODataExpressionVisitor.visit(query,this._expression);
            return this._base.client().get(this.url()+ODataQueryUtility.compileQuery(query));
        }
        return this._base.client().get(this.url());
    }

    getTracked() : Promise<Tracked<Entity>> {
        return new Promise<Tracked<Entity>>((resolve,reject)=>{
            this.get()
                .then((result : Entity)=> resolve(new Tracked(this._base,this._id,result)))
                .catch(reject)
        })
    }
}
