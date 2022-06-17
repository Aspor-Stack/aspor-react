import ODataBase, {AbstractODataBase} from "../ODataBase";
import {ODataQueryUtility} from "./ODataQueryUtility";
import {Expression} from "./expression/Expression";
import {ExpressionOperator} from "./expression/ExpressionOperator";
import {ProjectorType} from "./expression/proxy/ProxyFilterTypes";
import {FieldReference} from "./expression/field/FieldReference";
import {FieldsFor} from "./expression/field/FieldsForType";
import ODataQueryable from "./ODataQueryable";
import ODataQuerySegments from "./ODataQuerySegments";
import {ODataExpressionVisitor} from "./expression/ODataExpressionVisitor";
import {ODataResponse} from "../response/ODataResponse";
import ODataRequest from "../request/ODataRequest";
import ODataRequestMethod from "../request/ODataRequestMethod";
import ODataRequestType from "../request/ODataRequestType";

export default class ODataSingleQueryable<Entity, UEntity = Entity> extends AbstractODataBase{

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
        let url = this._base.url();
        if(this._name) url += "/"+this._name;
        if(this._id) url += "/"+this._id;
        return url;
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
            return new ODataSingleQueryable<Entity,U>(this,undefined,undefined,expression);
        }

        const expression = new Expression(ExpressionOperator.Select, (args as FieldsFor<Entity>[]).map(v => new FieldReference<Entity>(v)), this._expression);
        return new ODataSingleQueryable<Entity,U>(this,undefined,undefined,expression);
    }

    public expandMany<K>(projector: (proxy: Entity) => K[],subQuery? : (query : ODataQueryable<K>)=>void): ODataSingleQueryable<Entity, UEntity> {
        let query = undefined;
        if(subQuery) query = subQuery(new ODataQueryable<K>(this));

        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        projector(proxy as unknown as Entity);
        const expression = new Expression(ExpressionOperator.Expand, [query,[...ODataQueryUtility.getUsedPropertyPaths(proxy)]], this._expression);
        return new ODataSingleQueryable<Entity,UEntity>(this,undefined,undefined,expression);
    }

    public expand<K>(projector: (proxy: Entity) => K,subQuery? : (query : ODataQueryable<K>)=>void): ODataSingleQueryable<Entity, UEntity> {
        let query = undefined;
        if(subQuery) query = subQuery(new ODataQueryable<K>(this));

        const proxy = ODataQueryUtility.createProxiedEntity<Entity>();
        projector(proxy as unknown as Entity);
        const expression = new Expression(ExpressionOperator.Expand, [query,[...ODataQueryUtility.getUsedPropertyPaths(proxy)]], this._expression);
        return new ODataSingleQueryable<Entity,UEntity>(this,undefined,undefined,expression);
    }

    public expandAll() {
        const expression = new Expression(ExpressionOperator.ExpandAll, [], this._expression);
        return new ODataSingleQueryable<Entity,UEntity>(this,undefined,undefined,expression);
    }

    get() : ODataRequest<ODataResponse & UEntity> {
        let url : string;
        if(this._expression){
            let query : ODataQuerySegments = {}
            ODataExpressionVisitor.visit(query,this._expression);
            url = this.url()+ODataQueryUtility.compileQuery(query);
        }else{
            url = this.url();
        }
        return new ODataRequest<any>(this.client(),url,ODataRequestMethod.GET,ODataRequestType.ENTITY, this.formatters)
    }
}
