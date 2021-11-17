import {EntityProxy, lambdaVariable, propertyPath, PropertyProxy, proxyProperties} from "./expression/proxy/ProxyTypes";
import {ProxyPropertyPredicate} from "./expression/proxy/ProxyPropertyPredicate";
import {Expression} from "./expression/Expression";
import {ExpressionOperator} from "./expression/ExpressionOperator";
import ODataQuerySegments from "./ODataQuerySegments";


class QueryUtilityImpl {

    private lambdaProxyCounter = 0;

    createProxiedEntity<T>(isLambdaProxy = false): EntityProxy<T> {
        const lambdaVariableName = isLambdaProxy ? `p${this.lambdaProxyCounter++}` : '';
        return new Proxy({ [lambdaVariable]: lambdaVariableName, [proxyProperties]: [] }, {
            get: (instance: any, property: string | Symbol) => {
                if (typeof property === "symbol") {
                    switch(property) {
                        case lambdaVariable:
                            return instance[lambdaVariable];
                        case proxyProperties:
                            return instance[proxyProperties];
                        default:
                            throw new Error('Unkonwn symbol');
                    }
                }
                const path = [property as string];
                if (isLambdaProxy) {
                    path.unshift(lambdaVariableName);
                }
                const proxyProperty = this.createPropertyProxy(path);
                instance[proxyProperties].push(proxyProperty);
                return proxyProperty;
            }
        });
    }

    private createPropertyProxy<T>(navigationPath: string[]): PropertyProxy<T> {
        if (navigationPath.length === 0) throw new Error('PropertyProxy must be initialized with at least one proprety path');
        const target = { [propertyPath]: navigationPath, [proxyProperties]: [] };
        // @ts-ignore
        const predicate = new ProxyPropertyPredicate<T>(target as unknown as PropertyProxy<T>);
        return new Proxy(target, {
            get: (target: any, property: string | symbol) => {
                if(typeof property === "symbol") {
                    switch(property) {
                        case propertyPath:
                            return target[propertyPath];
                        case proxyProperties:
                            return target[proxyProperties];
                        default:
                            throw new Error('Unknown symbol');
                    }
                }

                if ((property).startsWith("$")) {
                    return ((predicate as unknown as any)[property.slice(1)] as Function).bind(predicate);
                }
                const propertyProxy = this.createPropertyProxy([...navigationPath, property]);
                target[proxyProperties].push(propertyProxy);
                return propertyProxy;
            }
        });
    }

    getUsedPropertyPaths(proxy: EntityProxy<any>): string[] {
        const paths: string[] = [];
        for (const p of proxy[proxyProperties]) {
            if (p[proxyProperties].length === 0) paths.push(p[propertyPath].join('/'));
            else paths.push(...ODataQueryUtility.getUsedPropertyPaths(p));
        }

        return Array.from(new Set(paths.flat()));
    }

    getSelectMap<T, U>(expression?: Expression): ((entity: T) => U) | undefined {
        while (expression != null) {
            if (expression.operator === ExpressionOperator.Select) {
                const firstOperand = expression.operands[0];
                return (typeof firstOperand === "function") ? firstOperand : undefined;
            }
            expression = expression.previous;
        }
        return;
    }

    compileQuery(segments : ODataQuerySegments){
        let query = "?";
        if(segments.filter) query += "$filter="+segments.filter+"&"
        if(segments.expand) query += "$expand="+segments.expand+"&"
        if(segments.orderBy) query += "orderBy="+segments.orderBy.join(",")+"&"
        if(segments.select) query += "$select="+segments.select.join(",")+"&"
        if(segments.top) query += "$top="+segments.top+"&"
        if(segments.skip) query += "$skip="+segments.skip+"&"
        if(segments.count) query += "$count="+segments.count+"&"
        return query;
    }

    compileInnerQuery(segments : ODataQuerySegments){
        let query = "";
        if(segments.filter) query += "$filter="+segments.filter+";"
        if(segments.expand) query += "$expand="+segments.expand+";"
        if(segments.orderBy) query += "orderBy="+segments.orderBy.join(",")+";"
        if(segments.select) query += "$select="+segments.select.join(",")+";"
        if(segments.top) query += "$top="+segments.top+";"
        if(segments.skip) query += "$skip="+segments.skip+";"
        if(segments.count) query += "$count="+segments.count+";"
        return query;
    }

}

export const ODataQueryUtility = new QueryUtilityImpl();
export default ODataQueryUtility
