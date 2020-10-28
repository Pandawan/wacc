import Lexer from "./src/lexer/lexer.ts";
import { printStatementAst } from "./src/parser/debug.ts";
import Parser from "./src/parser/parser.ts";
import { PrettyReporter } from "./src/parser/reporter.ts";

const source = `print 1 + 2 * 3; print 1 + 2; 1+ 4;`;

const lexer = new Lexer(source);

// printTokens(lexer)

const parser = new Parser(lexer, new PrettyReporter());
const result = parser.parseModule();
if (result[0]) {
  console.error("Some errors occured while parsing.");
} else {
  for (const statement of result[1].statements) {
    console.log(printStatementAst(statement));
  }
}
