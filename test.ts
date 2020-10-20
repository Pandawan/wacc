import Lexer from "./src/lexer/lexer.ts";
import Parser from "./src/parser/parser.ts";

const source = `1 + -2`;

const lexer = new Lexer(source);

// printTokens(lexer)

const parser = new Parser(lexer);
console.log(parser.parseModule());
