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
import { JsonReporter, Reporter } from "./reporter.ts";

// For now, modules are just arrays of expressions, but will be more later on.
type Module = Expression[];

type ParserResult =
  | [
    hadError: true,
    reporter: Reporter,
  ]
  | [
    hadError: false,
    module: Module,
  ];

export default class Parser {
  private lexer: Lexer;

  /**
   * The most recently consumed token.
   */
  private previous!: Token;
  /**
   * The current token yet to be consumed.
   */
  private current!: Token;

  /**
   * Whether or not an error occured while parsing.
   */
  private get hadError(): boolean {
    return this.reporter.hadError;
  }

  private reporter: Reporter;

  /**
   * Whether or not the parser is in panic mode,
   * ignoring all errors and attempting to synchronize to a safe state.
   */
  private panicMode: boolean;

  constructor(lexer: Lexer, reporter: Reporter = new JsonReporter()) { // By default create a JSON reporter
    this.lexer = lexer;
    this.reporter = reporter;
    this.panicMode = false;
  }

  parseModule(): ParserResult {
    const statements = [];

    this.consume(); // Start consuming the first token

    // TODO: Turn this into a while, and implement statements
    if (this.current.type !== TokenType.eof) {
      statements.push(this.parseExpression());

      // TODO: If panic mode, synchronize to a safe statement boundary
    }

    this.consume(TokenType.eof, "Expected end of input.");

    if (this.hadError) {
      return [true, this.reporter];
    }

    return [false, statements];
  }

  //#region Expression Parsers

  private parseExpression(): Expression {
    return this.parseEquality();
  }

  private parseEquality(): Expression {
    return this.parseInfix(
      [TokenType.bangEqual, TokenType.equalEqual],
      this.parseComparison.bind(this),
    );
  }

  private parseComparison(): Expression {
    return this.parseInfix(
      [
        TokenType.greater,
        TokenType.greaterEqual,
        TokenType.less,
        TokenType.lessEqual,
      ],
      this.parseTerm.bind(this),
    );
  }

  private parseTerm(): Expression {
    return this.parseInfix(
      [TokenType.minus, TokenType.plus],
      this.parseFactor.bind(this),
    );
  }

  private parseFactor(): Expression {
    return this.parseInfix(
      [TokenType.slash, TokenType.star],
      this.parseUnary.bind(this),
    );
  }

  private parseUnary(): Expression {
    if (this.match(TokenType.bang, TokenType.minus)) {
      const operator = this.previous.type;
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
      return new NumberExpression(Number(this.previous.lexeme));
    }

    if (this.match(TokenType.string)) {
      return new StringExpression(
        this.previous.lexeme.substring(0, this.previous.lexeme.length),
      );
    }

    this.error("Expected expression.");

    return new NullExpression();
  }

  //#endregion Expression Parsing

  //#region Utilities

  /**
   * Parse a left-associative series of infix operator expressions using any
   * of the given token types as operators and parsing the left and right 
   * operands using the given function.
   * @param tokenTypes Accepted tokens
   * @param parseOperand Function to parse the left and right operands
   */
  private parseInfix(tokenTypes: TokenType[], parseOperand: () => Expression) {
    let expr = parseOperand();
    while (this.match(...tokenTypes)) {
      const operator = this.previous.type;
      const right = parseOperand();
      expr = new InfixExpression(expr, operator, right);
    }

    return expr;
  }

  /**
   * Consumes the next token.
   */
  private consume(): Token;
  /**
   * Consumes the next token and verify that it matches the given type.
   * Otherwise, discard it and report an error.
   * @param type 
   * @param error 
   */
  private consume(type: TokenType, error: string): Token;
  private consume(type?: TokenType, error?: string): Token {
    this.previous = this.current;

    // Keep scanning until the next non-error token
    // This takes care of scanner errors without impacting the parser
    while (true) {
      this.current = this.lexer.scanToken();
      if (this.current.type !== TokenType.error) break;

      this.error(this.current.lexeme);
    }

    if (
      // Branching for consume with type & error
      type !== undefined && error !== undefined &&
      // Check that the types match
      this.current.type !== type
    ) {
      this.error(error);
    }

    return this.previous;
  }

  /**
   * Consumes and returns the next token if its type is contained in the list.
   * Returns null if none of the type matched.
   * @param types List of token types to match
   */
  private match(...types: TokenType[]): Token | null {
    for (const type of types) {
      if (this.current.type === type) {
        return this.consume();
      }
    }
    return null;
  }

  /**
   * Report an error while parsing the current token.
   * @param message
   */
  error(message: string, token?: Token) {
    // Ignore subsequent errors while panicking
    if (this.panicMode) return; // TODO: Add panic mode synchronization (once statements are in)

    // Use first token that is not null in chain: passed token -> current -> previous
    const tokenToReport = token ?? (this.current ?? this.previous);

    this.reporter.error(message, tokenToReport);

    // Set panic mode, wait for synchronization
    this.panicMode = true;
  }

  //#endregion Utilities
}
