import { FieldReference } from "./field/FieldReference";
import { BooleanPredicateBuilder } from "./BooleanPredicateBuilder";
import { Expression } from "./Expression";
import { Literal } from "./Literal";
import { ExpressionOperator } from "./ExpressionOperator";
import { ODataType } from "../../ODataType";
import ODataQueryable from "../ODataQueryable";
import {ODataQueryUtility} from "../ODataQueryUtility";
import ODataQuerySegments from "../ODataQuerySegments";
import {Guid} from "../../Guid";

export class ODataExpressionVisitorImpl {

    visit(query: ODataQuerySegments,expression: Expression): void {
        if (!expression) throw new Error(`'expression' is a required parameter.`);

        if (expression.previous) this.visit(query,expression.previous);

        const member = (this as any)[expression.operator + "Visitor"];

        if (typeof member !== "function") throw new Error(`No method found named '${expression.operator}Visitor'; '${expression.operator}' operator is not supported.`);
        member.apply(this,[query, ...expression.operands]);
    }

    selectVisitor(query: ODataQuerySegments,...fields: [Function | FieldReference<any>, ...FieldReference<any>[]]) {
        query.select = fields
        .filter(v => typeof v !== "function")
        .map(f => f.toString());
    }

    orderByVisitor(query: ODataQuerySegments,...fields: FieldReference<any>[]) {
        if(!query.orderBy) query.orderBy = [];
        query.orderBy.push(...fields.map(f => f.toString()));
    }

    orderByDescendingVisitor(query: ODataQuerySegments,...fields: FieldReference<any>[]) {
        if (!query.orderBy) query.orderBy = [];
        query.orderBy.push(...fields.map(f => f.toString() + " desc" ));
    }

    skipVisitor(query: ODataQuerySegments,value: number) {
        query.skip = value;
    }

    topVisitor(query: ODataQuerySegments,value: number) {
        query.top = value;
    }

    expandVisitor(query: ODataQuerySegments,expandQuery?: ODataQueryable<any>,...fields: [Function | FieldReference<any>, ...FieldReference<any>[]]) {
        let expand = fields[0].toString();
        if(!query.expand) query.expand = []
        if(expandQuery && expandQuery._expression){
            let innerQuery : ODataQuerySegments = {}
            this.visit(innerQuery,expandQuery._expression);
            query.expand.push(expand+"("+ODataQueryUtility.compileInnerQuery(innerQuery)+")")
        }else{
            query.expand.push(expand)
        }
    }

    expandAllVisitor(query: ODataQuerySegments) {
        query.expand = ["*"];
    }

    getWithCountVisitor(query: ODataQuerySegments) {
        query.count = true;
    }

    getByKeyVisitor(query: ODataQuerySegments,key: any) {
        if (key instanceof Expression) {
            if (key.operator !== ExpressionOperator.Literal) throw new Error(`Only literal expressions allowed for ${ExpressionOperator.Literal} expession types`);
            key = key.operands[0];
        }

        if (!(key instanceof Literal))
            key = new Literal(key);

        query.key = this.deriveLiteral(key);
    }

    valueVisitor(query: ODataQuerySegments) {
        query.value = true;
    }

    predicateVisitor(query: ODataQuerySegments,predicate: BooleanPredicateBuilder<any>) {
        if (!predicate.expression) return;

        if (predicate.expression.previous) throw new Error(`Filter Expressions cannot have a value for 'previous', only operands`);

        let filter = this.translatePredicateExpression(predicate.expression);

        if (query.filter && filter.length > 1) {
            filter = ['(', ...filter, ')'];
        }

        if (query.filter) query.filter = filter.join(' ');
        else query.filter += " and "+ filter.join(' ')
    }

    private translatePredicateExpression(expression: Expression): string[] {
        let translation: string[][] = [];
        for (let operand of expression.operands) {
            if (operand instanceof Literal) {
                translation.push([this.deriveLiteral(operand)]);
            }
            else if (operand instanceof FieldReference) {
                translation.push([operand.toString()]);
            }
            else if (operand instanceof Expression) {
                translation.push(this.translatePredicateExpression(operand));
            }
            else if (operand instanceof Array) {
                translation.push([operand.map(i => this.deriveLiteral(new Literal(i))).join(',')]);
            }
            else //assume this is a literal without the type specified
                translation.push([this.deriveLiteral(new Literal(operand))]);
        }

        if (translation.length === 1) {
            switch (expression.operator) {
                case ExpressionOperator.Not:
                    return ['not ' + this.reduceTranslatedExpression(translation[0])];
                default:
                    throw new Error(`Operator '${expression.operator}' is not supported`);
            }

        }
        else if (translation.length === 2) {
            let [left, right] = translation;

            switch (expression.operator) {
                case ExpressionOperator.And:
                    return [this.reduceTranslatedExpression(left), 'and', this.reduceTranslatedExpression(right)];
                case ExpressionOperator.Or:
                    return [this.reduceTranslatedExpression(left), 'or', this.reduceTranslatedExpression(right)];
                case ExpressionOperator.Equals:
                    return [`${this.reduceTranslatedExpression(left)} eq ${this.reduceTranslatedExpression(right)}`];
                case ExpressionOperator.GreaterThan:
                    return [`${this.reduceTranslatedExpression(left)} gt ${this.reduceTranslatedExpression(right)}`];
                case ExpressionOperator.GreaterThanOrEqualTo:
                    return [`${this.reduceTranslatedExpression(left)} ge ${this.reduceTranslatedExpression(right)}`];
                case ExpressionOperator.LessThan:
                    return [`${this.reduceTranslatedExpression(left)} lt ${this.reduceTranslatedExpression(right)}`];
                case ExpressionOperator.LessThanOrEqualTo:
                    return [`${this.reduceTranslatedExpression(left)} le ${this.reduceTranslatedExpression(right)}`];
                case ExpressionOperator.NotEquals:
                    return [`${this.reduceTranslatedExpression(left)} ne ${this.reduceTranslatedExpression(right)}`];
                case ExpressionOperator.Contains:
                    return [`contains(${this.reduceTranslatedExpression(left)},${this.reduceTranslatedExpression(right)})`];
                case ExpressionOperator.StartsWith:
                    return [`startsWith(${this.reduceTranslatedExpression(left)},${this.reduceTranslatedExpression(right)})`];
                case ExpressionOperator.EndsWith:
                    return [`endsWith(${this.reduceTranslatedExpression(left)},${this.reduceTranslatedExpression(right)})`];
                case ExpressionOperator.In:
                    return [`${this.reduceTranslatedExpression(left)} in (${this.reduceTranslatedExpression(right)})`];
                default:
                    throw new Error(`Operator '${expression.operator}' is not supported`);
            }
        }
        else if (translation.length === 3) {
            let [left, center, right] = translation;
            switch (expression.operator) {
                case ExpressionOperator.Any:
                    return [`${this.reduceTranslatedExpression(left)}/any(${center}: ${this.reduceTranslatedExpression(right)})`];
                case ExpressionOperator.All:
                    return [`${this.reduceTranslatedExpression(left)}/all(${center}: ${this.reduceTranslatedExpression(right)})`];
                default:
                    throw new Error(`Operator '${expression.operator}' is not supported`);
            }
        }

        throw new Error(`Operator '${expression.operator}' is not supported`);

    }

    private reduceTranslatedExpression(value: string[]) {
        if (value.length === 0) return "";

        if (value.length === 1)
            return `${value[0]}`;

        return `(${value.join(' ')})`;
    }

    private deriveLiteral(literal: Literal): string {
        const value = literal.value;

        switch (literal.literalType) {
            case ODataType.Date:
                return new Date(value).toISOString().substring(0, 10);
            case ODataType.Guid:
                return value.toString();
        }

        if (value === null) return "null";
        if (value instanceof Date) return value.toISOString();
        if (value instanceof Guid) return value.toString();

        switch (typeof value) {
            case "string":
                return `'${value}'`;
            case "number":
            case "boolean":
                return value.toString();
            case "undefined":
                return 'null';
            case "function":
                throw new Error("function not supported");
            case "symbol":
                throw new Error("symbol not supported");
            case "object":
                //objects handled below
                break;
            default:
                throw new Error(`Unhandled primitive type: ${value}`);
        }

        return value.toString();
    }
}

export const ODataExpressionVisitor = new ODataExpressionVisitorImpl();
