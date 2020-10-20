import Lexer from "../lexer/lexer.ts";
import Token, { TokenType } from "../lexer/token.ts";
import {
  BoolExpression,
  Expression,
  InfixExpression,
  NullExpression,
  NumberExpression,
  PrefixExpression,
  StringExpression,
} from "./ast.ts";

export default class Parser {
  private lexer: Lexer;
  /**
   * The most recently consumed token.
   */
  private previous: Token | null;
  /**
   * The current token yet to be consumed.
   */
  private current: Token | null;
  private hadError: boolean;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.previous = null;
    this.current = null;
    this.hadError = false;
  }

  parseModule() {
    const statements = [];
    while (this.peek() !== TokenType.eof) {
      statements.push(this.parseExpression());
    }

    this.consume(TokenType.eof, "Expected end of input.");
    return statements;
  }

  private parseExpression(): Expression {
    return this.parseEquality();
  }

  private parseEquality(): Expression {
    let expr = this.parseComparison();
    // TODO: Look into parseInfix (https://github.com/munificent/wrenalyzer/blob/master/parser.wren#L658)
    while (this.match(TokenType.bangEqual, TokenType.equalEqual)) {
      const operator = this.previous!.type; // HACK: non-null assertion
      const right = this.parseComparison();
      expr = new InfixExpression(expr, operator, right);
    }
    return expr;
  }

  private parseComparison(): Expression {
    let expr = this.parseTerm();

    while (
      this.match(
        TokenType.greater,
        TokenType.greaterEqual,
        TokenType.less,
        TokenType.lessEqual,
      )
    ) {
      const operator = this.previous!.type; // HACK: non-null assertion
      const right = this.parseTerm();
      expr = new InfixExpression(expr, operator, right);
    }
    return expr;
  }

  private parseTerm(): Expression {
    let expr = this.parseFactor();

    while (this.match(TokenType.minus, TokenType.plus)) {
      const operator = this.previous!.type; // HACK: non-null assertion
      const right = this.parseFactor();
      expr = new InfixExpression(expr, operator, right);
    }
    return expr;
  }

  private parseFactor(): Expression {
    let expr = this.parseUnary();

    while (this.match(TokenType.slash, TokenType.star)) {
      const operator = this.previous!.type; // HACK: non-null assertion
      const right = this.parseUnary();
      expr = new InfixExpression(expr, operator, right);
    }
    return expr;
  }

  private parseUnary(): Expression {
    if (this.match(TokenType.bang, TokenType.minus)) {
      const operator = this.previous!.type; // HACK: non-null assertion
      const right = this.parseUnary();
      return new PrefixExpression(operator, right);
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expression {
    if (this.match(TokenType.false)) return new BoolExpression(false);
    if (this.match(TokenType.true)) return new BoolExpression(true);
    if (this.match(TokenType.null)) return new NullExpression();

    if (this.match(TokenType.number)) {
      return new NumberExpression(Number(this.previous!.lexeme)); // HACK: non-null assertion
    }

    if (this.match(TokenType.string)) {
      return new StringExpression(
        this.previous!.lexeme.substring(0, this.previous!.lexeme.length - 1), // HACK: non-null assertion
      );
    }

    this.error("Expected expression.");

    return new NullExpression();
  }

  private consume(): Token;
  private consume(type: TokenType, error: string): Token;
  private consume(type?: TokenType, error?: string): Token {
    // Get the next token
    this.peek();
    this.previous = this.current;
    this.current = null;

    if (type !== undefined && error !== undefined) {
      if (this.previous?.type !== type) {
        this.error(error);
      }
    }

    // TODO: Find a better approach that doesn't require non-null assertion
    // HACK: non-null assertion
    return this.previous!;
  }

  /**
   * Consumes and returns the next token if its type is contained in the list.
   * Returns null if none of the type matched.
   * @param types List of token types to match
   */
  private match(...types: TokenType[]): Token | null {
    for (const type of types) {
      if (this.peek() === type) {
        return this.consume();
      }
    }
    return null;
  }

  /**
   * Get the next token.
   */
  private peek(): TokenType {
    if (this.current === null) {
      this.current = this.lexer.scanToken();
    }
    return this.current.type;
  }

  /**
   * Report an error while parsing the current token.
   * @param message
   */
  error(message: string) {
    // TODO: Real error reporting
    console.error(message, this.current ?? this.previous);
  }
}
