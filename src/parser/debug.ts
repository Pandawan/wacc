import {
  Expression,
  Statement,
} from "./ast.ts";

export function printExpressionAst(expr: Expression): string {
  switch (expr.type) {
    case "infix":
      return `(${expr.operator} ${printExpressionAst(expr.left)} ${
        printExpressionAst(expr.right)
      })`;
    case "prefix":
      return `(${expr.operator} ${printExpressionAst(expr.right)})`;
    case "bool":
      return expr.value.toString();
    case "null":
      return "null";
    case "number":
      return expr.value.toString();
    case "string":
      return expr.value;
    default:
      throw new Error(`Unexpected expression type: ${expr}`);
  }
}

export function printStatementAst(stmt: Statement): string {
  switch (stmt.type) {
    case "expression":
      return `(expression ${printExpressionAst(stmt.expression)})`;
    case "print":
      return `(print ${printExpressionAst(stmt.expression)})`;
    default:
      throw new Error(`Unexpected statement type: ${stmt}`);
  }
}
