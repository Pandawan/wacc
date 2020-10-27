import Lexer from "./src/lexer/lexer.ts";
import { Module } from "./src/parser/ast.ts";
import { printAst } from "./src/parser/debug.ts";
import Parser from "./src/parser/parser.ts";
import { PrettyReporter } from "./src/parser/reporter.ts";

const source = `print 1 + 2 * 3;`;

const lexer = new Lexer(source);

// printTokens(lexer)

const parser = new Parser(lexer, new PrettyReporter());
const [hadError, module] = parser.parseModule();
console.log(
  hadError
    ? "Some errors occured while parsing."
    : printAst(((module as Module).statements[0] as any).expression),
);
