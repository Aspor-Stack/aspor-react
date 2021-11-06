import { Literal } from "./Literal";
import { ExpressionOperator } from "./ExpressionOperator";

export class Expression {
    constructor(public operator: ExpressionOperator, public operands: any[], public previous?: Expression) { }

    static literal<T>(value: T, literalType: string = typeof value) {
        return new TypedExpression<T>(ExpressionOperator.Literal, [new Literal(value, literalType)]);
     }
}

// eslint-disable-next-line
export class TypedExpression<T> extends Expression { }
