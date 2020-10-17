import Lexer from "./src/lexer/lexer.ts";
import { TokenType } from "./src/lexer/token.ts";

const source = `print 1 + 2; abc "hello world" true // comment`;

const lexer = new Lexer(source);

// Trying out the lexer and outputting tokens
let line = 0;
while (true) {
  let outputStr = "";

  const token = lexer.scanToken();

  if (token.line !== line) {
    outputStr += line.toString().padStart(4) + " ";
    line = token.line;
  } else {
    outputStr += "   | ";
  }

  outputStr += `${TokenType[token.type]} '${token.lexeme}'`;

  console.log(outputStr);

  if (token.type === TokenType.EOF) break;
}
