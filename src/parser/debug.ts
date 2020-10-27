import { CharCode } from "../lexer/chars.ts";
import { TokenType } from "../lexer/token.ts";
import {
  BoolExpression,
  Expression,
  InfixExpression,
  NullExpression,
  NumberExpression,
  PrefixExpression,
  StringExpression,
  Visitor,
} from "./ast.ts";

class AstPrinter implements Visitor<string> {
  print(expr: Expression): string {
    return expr.accept(this);
  }

  visitInfixExpression(expr: InfixExpression): string {
    return `(${expr.operator} ${expr.left.accept(this)} ${
      expr.right.accept(this)
    })`;
  }
  visitPrefixExpression(expr: PrefixExpression): string {
    return `${expr.operator} ${expr.right.accept}`;
  }
  visitBoolExpression(expr: BoolExpression): string {
    return expr.value.toString();
  }
  visitNullExpression(expr: NullExpression): string {
    return "null";
  }
  visitNumberExpression(expr: NumberExpression): string {
    return expr.value.toString();
  }
  visitStringExpression(expr: StringExpression): string {
    return expr.value;
  }
}

export function printAst(expr: Expression): string {
  const printer = new AstPrinter();
  return printer.print(expr);
}
