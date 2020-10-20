import Lexer from "./lexer.ts";
import { TokenType } from "./token.ts";

export function printTokens(lexer: Lexer) {
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

    outputStr += `${token.type} '${token.lexeme}'`;

    console.log(outputStr);

    if (token.type === TokenType.eof) break;
  }
}
