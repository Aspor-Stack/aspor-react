import { Expression } from "./Expression";
import { ExpressionOperator } from "./ExpressionOperator";

export class BooleanPredicateBuilder<T> {

    constructor(public readonly expression?: Expression) { }

    public and(predicate: BooleanPredicateBuilder<T>) {
        if (!this.expression)
            throw new Error(`'and' predicate must come after a non-empty Predicate`);
        if (!predicate.expression)
            throw new Error(`'and' predicate must have at least one non-empty Predicate`);

        return new BooleanPredicateBuilder<T>(new Expression(ExpressionOperator.And, [this.expression, predicate.expression]));
    }

    public or(predicate: BooleanPredicateBuilder<T>) {
        if (!this.expression)
            throw new Error(`'or' predicate must come after a non-empty Predicate`);
        if (!predicate.expression)
            throw new Error(`'or' predicate must have at least one non-empty Predicate`);

        return new BooleanPredicateBuilder<T>(new Expression(ExpressionOperator.Or, [this.expression, predicate.expression]));
    }
}
