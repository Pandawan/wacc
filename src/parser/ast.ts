import { TokenType } from "../lexer/token.ts";

export class Module {
  constructor(public readonly statements: Statement[]) {
  }
}

/*
 Note: I'm attempting to use the simpler "plain old data" structure for my AST 
 rather than using Object Orientation. 
 This means I won't be using the visitor pattern, but I have found that using  
 switch statements seems to work just as well, all the while keeping the code
 plain and simple. 

 See discussion: https://softwareengineering.stackexchange.com/q/418389/378370
*/

//#region Expressions

export type Expression =
  | InfixExpression
  | PrefixExpression
  | BoolExpression
  | NullExpression
  | NumberExpression
  | StringExpression;

export interface InfixExpression {
  type: "infix";
  left: Expression;
  operator: TokenType;
  right: Expression;
}

export interface PrefixExpression {
  type: "prefix";
  operator: TokenType;
  right: Expression;
}

export interface BoolExpression {
  type: "bool";
  value: boolean;
}

export interface NullExpression {
  type: "null";
}

export interface NumberExpression {
  type: "number";
  value: number;
}

export interface StringExpression {
  type: "string";
  value: string;
}
//#endregion Expressions

//#region Statements

export type Statement =
  | PrintStatement
  | ExpressionStatement;

export interface PrintStatement {
  type: "print";
  expression: Expression;
}

export interface ExpressionStatement {
  type: "expression";
  expression: Expression;
}
//#endregion
