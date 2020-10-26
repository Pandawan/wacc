import { TokenType } from "../lexer/token.ts";

export interface Node {}

export interface Expression extends Node {}
export interface Statement extends Node {}

export class Module implements Node {
  constructor(public statements: Statement[]) {}
}

//#region Expressions

export class InfixExpression implements Expression {
  constructor(
    public left: Expression,
    public operator: TokenType,
    public right: Expression,
  ) {}
}

export class PrefixExpression implements Expression {
  constructor(
    public operator: TokenType,
    public right: Expression,
  ) {}
}

export class BoolExpression implements Expression {
  constructor(public value: boolean) {}
}

export class NullExpression implements Expression {
}

export class NumberExpression implements Expression {
  constructor(public value: number) {}
}

export class StringExpression implements Expression {
  constructor(public value: string) {}
}

//#endregion Expressions

//#region Statements

export class PrintStatement implements Statement {
  constructor(public expression: Expression) {}
}

export class ExpressionStatement implements Statement {
  constructor(public expression: Expression) {}
}

//#endregion
