import { TokenType } from "../lexer/token.ts";

export interface Node {}

export interface Expression extends Node {
  accept<R>(visitor: Visitor<R>): R;
}
export interface Statement extends Node {}

export interface Visitor<R> {
  visitInfixExpression(expr: InfixExpression): R;
  visitPrefixExpression(expr: PrefixExpression): R;
  visitBoolExpression(expr: BoolExpression): R;
  visitNullExpression(expr: NullExpression): R;
  visitNumberExpression(expr: NumberExpression): R;
  visitStringExpression(expr: StringExpression): R;
}

export class Module implements Node {
  constructor(public readonly statements: Statement[]) {}
}

//#region Expressions

export class InfixExpression implements Expression {
  constructor(
    public readonly left: Expression,
    public readonly operator: TokenType,
    public readonly right: Expression,
  ) {}

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitInfixExpression(this);
  }
}

export class PrefixExpression implements Expression {
  constructor(
    public readonly operator: TokenType,
    public readonly right: Expression,
  ) {}

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrefixExpression(this);
  }
}

export class BoolExpression implements Expression {
  constructor(public readonly value: boolean) {}

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBoolExpression(this);
  }
}

export class NullExpression implements Expression {
  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitNullExpression(this);
  }
}

export class NumberExpression implements Expression {
  constructor(public readonly value: number) {}

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitNumberExpression(this);
  }
}

export class StringExpression implements Expression {
  constructor(public readonly value: string) {}

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitStringExpression(this);
  }
}

//#endregion Expressions

//#region Statements

export class PrintStatement implements Statement {
  constructor(public readonly expression: Expression) {}
}

export class ExpressionStatement implements Statement {
  constructor(public readonly expression: Expression) {}
}

//#endregion
