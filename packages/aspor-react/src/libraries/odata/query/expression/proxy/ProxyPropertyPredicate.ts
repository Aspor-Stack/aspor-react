import { ArrayProxyFieldPredicateInterface, EqualityProxyFieldPredicate, InequalityProxyFieldPredicate, PredicateArgument, StringProxyFieldPredicateInterface } from "./ProxyFilterTypes";
import { EntityProxy, propertyPath, lambdaVariable, PropertyProxy } from "./ProxyTypes";
import {FieldReference} from "../field/FieldReference";
import {ExpressionOperator} from "../ExpressionOperator";
import { FilterAccessoryFunctions } from "../FilterAccessoryFunctions";
import {BooleanPredicateBuilder} from "../BooleanPredicateBuilder";
import { Expression } from "../Expression";
import {ODataQueryUtility} from "../../ODataQueryUtility";

export class ProxyPropertyPredicate<T> implements
    EqualityProxyFieldPredicate<T>,
    InequalityProxyFieldPredicate<T>,
    StringProxyFieldPredicateInterface,
    ArrayProxyFieldPredicateInterface {
    private readonly fieldReference: FieldReference<T>;

    constructor(propertyProxy: PropertyProxy<T>) {
        this.fieldReference = this.getFieldReference(propertyProxy);
    }

    equals(value: PredicateArgument<T>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.Equals);
    }

    notEquals(value: PredicateArgument<T>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.NotEquals);
    }

    in(value: ArrayLike<PredicateArgument<T>> | Iterable<PredicateArgument<T>>) {
        return this.buildPredicateBuilder(Array.from(value), ExpressionOperator.In);
    }

    lessThan(value: PredicateArgument<T>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.LessThan);
    }

    lessThanOrEqualTo(value: PredicateArgument<T>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.LessThanOrEqualTo);
    }

    greaterThan(value: PredicateArgument<T>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.GreaterThan);
    }

    greaterThanOrEqualTo(value: PredicateArgument<T>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.GreaterThanOrEqualTo);
    }

    contains(value: PredicateArgument<string>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.Contains);
    }

    startsWith(value: PredicateArgument<string>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.StartsWith);
    }

    endsWith(value: PredicateArgument<string>) {
        return this.buildPredicateBuilder(value, ExpressionOperator.EndsWith);
    }

    any<U>(value: (entity: EntityProxy<U, true>, compound: FilterAccessoryFunctions<U>) => BooleanPredicateBuilder<U[]>) {
        const proxy = ODataQueryUtility.createProxiedEntity<U>(true);
        // @ts-ignore
        const expression = value(proxy, new FilterAccessoryFunctions<U>()).expression;
        return this.buildCollectionFilterPredicateBuilder(expression!, ExpressionOperator.Any, proxy);
    }

    all<U>(value: (entity: EntityProxy<U, true>, compound: FilterAccessoryFunctions<U>) => BooleanPredicateBuilder<U[]>) {
        const proxy = ODataQueryUtility.createProxiedEntity<U>(true);
        // @ts-ignore
        const expression = value(proxy, new FilterAccessoryFunctions<U>()).expression;
        return this.buildCollectionFilterPredicateBuilder(expression!, ExpressionOperator.All, proxy);
    }

    private buildCollectionFilterPredicateBuilder<P>(value: Expression, operator: ExpressionOperator, proxy: EntityProxy<P>) {
        let operand: any = value;
        const propertyPaths = value == null ? null : (value as any)[propertyPath] as string[] | undefined;
        if (propertyPaths != null) {
            operand = this.getFieldReference(value as unknown as PropertyProxy<T>)
        }
        // eslint-disable-next-line
        const expression = new Expression(operator, [this.fieldReference, String(proxy[lambdaVariable]), operand]);
        return new BooleanPredicateBuilder<P>(expression);
    }

    protected buildPredicateBuilder<P>(value: P | PropertyProxy<P>, operator: ExpressionOperator) {
        let operand: any = value;
        const propertyPaths = value == null ? null : (value as any)[propertyPath] as string[] | undefined;
        if (propertyPaths != null) {
            operand = this.getFieldReference(value as unknown as PropertyProxy<T>)
        }
        const expression = new Expression(operator, [this.fieldReference, operand]);
        return new BooleanPredicateBuilder<P>(expression);
    }

    private getFieldReference(propertyProxy: PropertyProxy<T>) {
        const propertyPaths = propertyProxy[propertyPath];
        // TODO: Better handle typing here
        return new FieldReference(propertyPaths.join('/')) as unknown as FieldReference<T>;
    }
}
