import ODataBase, {AbstractODataBase} from "../ODataBase";
import {ODataResult} from "./ODataResult";
import {ODataQueryUtility} from "./ODataQueryUtility";
import {ODataExpressionVisitor} from "./expression/ODataExpressionVisitor";
import {Expression} from "./expression/Expression";
import {BooleanPredicateBuilder} from "./expression/BooleanPredicateBuilder";
import { FilterAccessoryFunctions } from "./expression/FilterAccessoryFunctions";
import {EntityProxy, propertyPath, PropertyProxy} from "./expression/proxy/ProxyTypes";
import {ExpressionOperator} from "./expression/ExpressionOperator";
import {ProjectorType} from "./expression/proxy/ProxyFilterTypes";
import {FieldReference} from "./expression/field/FieldReference";
import {FieldsFor} from "./expression/field/FieldsForType";
import ODataQuerySegments from "./ODataQuerySegments";

export default class ODataQueryable<Entity, UEntity = Entity> extends AbstractODataBase{

    protected readonly _name? : string;
    public readonly _expression?: Expression

    constructor(base : ODataBase,name? : string,expression?: Expression) {
        super(base)
        this._name = name;
        this._expression = expression;
    }

    url() : string {
        if(this._name) return this._base.url()+"/"+this._name;
        return this._base.url();
    }

    public filter(predicate: BooleanPredicateBuilder<Entity> | ((builder: EntityProxy<Entity, true>, functions: FilterAccessoryFunctions<Entity>) => BooleanPredicateBuilder<Entity>)) {
        if (typeof predicate === "function"){
            predicate = predicate(ODataQueryUtility.createProxiedEntity<Entity>(), new FilterAccessoryFunctions<Entity>());
        }
        const expression = new Expression(ExpressionOperator.Predicate, [predicate], this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public orderBy(fields: (entity: EntityProxy<Entity>) => PropertyProxy<unknown> | Array<PropertyProxy<unknown>>) {
        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        const properties = [fields(proxy)].flat()
        const expression = new Expression(ExpressionOperator.OrderBy, properties.map(f => new FieldReference(f[propertyPath].join('/'))), this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public orderByDesc(fields: (entity: EntityProxy<Entity>) => PropertyProxy<unknown> | Array<PropertyProxy<unknown>>) {
        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        const properties = [fields(proxy)].flat()
        const expression = new Expression(ExpressionOperator.OrderByDescending, properties.map((f => new FieldReference(f[propertyPath].join('/')))), this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public select<U extends FieldsFor<Entity>>(...fields: U[]): ODataQueryable<Entity, U>;
    public select<U extends ProjectorType>(projector: (proxy: Entity) => U): ODataQueryable<Entity, U>;
    public select<U>(...args: [(proxy: Entity) => U | FieldsFor<Entity>, ...FieldsFor<Entity>[]]) {
        if (args.length === 0) throw new Error('Parameters are required');

        const firstArg = args[0];
        if (typeof firstArg === "function") {
            const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
            firstArg(proxy as unknown as Entity);
            const expression = new Expression(ExpressionOperator.Select, [firstArg, ...ODataQueryUtility.getUsedPropertyPaths(proxy)], this._expression);
            return new ODataQueryable<Entity,U>(this,undefined,expression);
        }

        const expression = new Expression(ExpressionOperator.Select, (args as FieldsFor<Entity>[]).map(v => new FieldReference<Entity>(v)), this._expression);
        return new ODataQueryable<Entity,U>(this,undefined,expression);
    }

    public expandMany<K>(projector: (proxy: Entity) => K[],subQuery? : (query : ODataQueryable<K>)=>ODataQueryable<any>): ODataQueryable<Entity, UEntity> {
        let query = undefined;
        if(subQuery) query = subQuery(new ODataQueryable<K>(this));

        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        projector(proxy as unknown as Entity);
        const expression = new Expression(ExpressionOperator.Expand, [query,[...ODataQueryUtility.getUsedPropertyPaths(proxy)]], this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public expand<K>(projector: (proxy: Entity) => K,subQuery? : (query : ODataQueryable<K>)=>ODataQueryable<any>): ODataQueryable<Entity, UEntity> {
        let query = undefined;
        if(subQuery) query = subQuery(new ODataQueryable<K>(this));

        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        projector(proxy as unknown as Entity);
        const expression = new Expression(ExpressionOperator.Expand, [query,[...ODataQueryUtility.getUsedPropertyPaths(proxy)]], this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public expandAll() {
        const expression = new Expression(ExpressionOperator.ExpandAll, [], this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public top(n: number) {
        const expression = new Expression(ExpressionOperator.Top, [n], this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    public skip(n: number) {
        const expression = new Expression(ExpressionOperator.Skip, [n], this._expression);
        return new ODataQueryable<Entity,UEntity>(this,undefined,expression);
    }

    getMany() : Promise<ODataResult<UEntity>> {
        if(this._expression){
            let query : ODataQuerySegments = {}
            ODataExpressionVisitor.visit(query,this._expression);
            return this._base.client().getMany(this.url()+ODataQueryUtility.compileQuery(query));
        }
        return this._base.client().getMany(this.url());
    }

    getManyWithCount() : Promise<ODataResult<UEntity>> {
        if(this._expression){
            let query : ODataQuerySegments = {count: true}
            ODataExpressionVisitor.visit(query,this._expression);
            return this._base.client().getMany(this.url()+ODataQueryUtility.compileQuery(query));
        }
        return this._base.client().getMany(this.url()+"?$count=true");
    }

    getFirst() : Promise<UEntity> {
        if(this._expression){
            let query : ODataQuerySegments = {}
            ODataExpressionVisitor.visit(query,this._expression);
            query.top = 1;
            return new Promise((resolve,reject)=>{
                this._base.client().get(this.url()+ODataQueryUtility.compileQuery(query))
                    .then((result : any)=>{
                        if(result.value && result.value.length > 0) return result.value[0];
                        else reject();
                    }).catch(reject)
            });
        }else{
            return new Promise((resolve,reject)=>{
                this._base.client().get(this.url()+"?$top=1")
                    .then((result : any)=>{
                        if(result.value && result.value.length > 0) return result.value[0];
                        else reject();
                    }).catch(reject)
            });
        }
    }
}
