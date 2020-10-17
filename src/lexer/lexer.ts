import Token, { TokenType } from "./token.ts";
import { CharCode, isAlpha, isDigit, isAlphanumeric } from "./chars.ts";

const KEYWORDS: { [str: string]: TokenType } = {
  "class": TokenType.class,
  "else": TokenType.else,
  "false": TokenType.false,
  "fn": TokenType.fn,
  "for": TokenType.for,
  "if": TokenType.if,
  "null": TokenType.null,
  "print": TokenType.print,
  "return": TokenType.return,
  "super": TokenType.super,
  "this": TokenType.this,
  "true": TokenType.true,
  "var": TokenType.var,
  "while": TokenType.while,
};

export default class Lexer {
  private source: string;

  /**
   * Starting position of the current lexeme.
   */
  private start: number;
  /**
   * Current position of the scanner.
   */
  private current: number;
  /**
   * Number of the line currently being read.
   */
  private line: number;

  constructor(source: string) {
    this.source = source;
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  /**
   * Scan the next token.
   */
  scanToken(): Token {
    this.skipWhitespace();

    this.start = this.current;

    if (this.isAtEnd()) {
      return this.makeToken(TokenType.eof);
    }

    let c = this.advance();

    // Don't want to switch over all possible characters, so match them early here
    if (isAlpha(c)) return this.makeIdentifierOrKeyword();
    if (isDigit(c)) return this.makeNumber();

    switch (c) {
      case CharCode.leftParen:
        return this.makeToken(TokenType.leftParen);
      case CharCode.rightParen:
        return this.makeToken(TokenType.rightBrace);
      case CharCode.rightBrace:
        return this.makeToken(TokenType.leftBrace);
      case CharCode.rightParen:
        return this.makeToken(TokenType.rightBrace);
      case CharCode.comma:
        return this.makeToken(TokenType.comma);
      case CharCode.dot:
        return this.makeToken(TokenType.dot);
      case CharCode.minus:
        return this.makeToken(TokenType.minus);
      case CharCode.plus:
        return this.makeToken(TokenType.plus);
      case CharCode.semicolon:
        return this.makeToken(TokenType.semicolon);
      case CharCode.slash:
        return this.makeToken(TokenType.slash);
      case CharCode.star:
        return this.makeToken(TokenType.star);

      case CharCode.bang:
        return this.makeToken(
          this.match(CharCode.equal) ? TokenType.bangEqual : TokenType.bang,
        );
      case CharCode.equal:
        return this.makeToken(
          this.match(CharCode.equal) ? TokenType.equalEqual : TokenType.equal,
        );
      case CharCode.less:
        return this.makeToken(
          this.match(CharCode.equal) ? TokenType.lessEqual : TokenType.less,
        );
      case CharCode.greater:
        return this.makeToken(
          this.match(CharCode.equal)
            ? TokenType.greaterEqual
            : TokenType.greater,
        );

      case CharCode.quote:
        return this.makeString();
    }

    return this.makeErrorToken("Unexpected character");
  }

  //#region Token Creators

  /** 
   * Make a token with the given type.
   * @param type
   */
  makeToken(type: TokenType): Token {
    return {
      type,
      lexeme: this.source.substring(this.start, this.current),
      start: this.start,
      length: this.current - this.start,
      line: this.line,
    };
  }

  /** 
   * Make an error token with the given error message.
   * @param message
   */
  makeErrorToken(message: string): Token {
    return {
      type: TokenType.error,
      // In error token, the lexeme is the error message
      lexeme: message,
      start: this.start,
      length: this.current - this.start,
      line: this.line,
    };
  }

  /**
   * Make a string token.
   * Assumes the leading quote (") has already been consumed.
   */
  makeString(): Token {
    // Keep consuming until a closing quote (") or eof is reached.
    while (this.peek() !== '"' && this.isAtEnd() === false) {
      // Support multiline strings
      if (this.peek() === "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd() === true) {
      return this.makeErrorToken("Unterminated string");
    }

    this.advance();
    return this.makeToken(TokenType.string);
  }

  /**
   * Make a number token.
   * Assumes the leading digit has already been consumed.
   */
  makeNumber(): Token {
    // Keep consuming digits
    while (isDigit(this.peek())) this.advance();

    // Look for fractional part
    if (this.peek() === "." && isDigit(this.peekNext())) {
      // Consume the dot (.)
      this.advance();

      // Keep consuming fractional digits
      while (isDigit(this.peek())) this.advance();
    }

    return this.makeToken(TokenType.number);
  }

  /**
   * Make an identifier or keyword token.
   * Assumes the leading alpha has already been consumed.
   * (These two types are grouped because they are both scanned in a similar fashion).
   */
  makeIdentifierOrKeyword(): Token {
    // Keep consuming alpha (letters and underscore) or digits
    while (isAlphanumeric(this.peek())) {
      this.advance();
    }

    // Look for keyword that matches the current lexeme, otherwise it's an identifier
    const tokenType = KEYWORDS[
      this.source.substring(this.start, this.current)
    ] ?? TokenType.identifier;

    return this.makeToken(tokenType);
  }

  //#endregion

  //#region Scanning Utilities

  /** 
   * Whether or not the scanner has reached the end of the source string.
   */
  isAtEnd(): boolean {
    return this.current === this.source.length;
  }

  /**
   * Get the current character without consuming it.
   */
  peek(): string {
    return this.source.charAt(this.current);
  }

  /**
   * Get the next character without consuming it.
   */
  peekNext(): string {
    if (this.isAtEnd()) return "";
    return this.source.charAt(this.current + 1);
  }

  /**
   * Consume the current character and return it.
   */
  advance(): string {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  /**
   * Look for the given expected character, consuming it if found.
   * Returns true if it succeeded.
   * @param expectedChar
   */
  match(expectedChar: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expectedChar) return false;

    this.current++;
    return true;
  }

  /**
   * Skip whitespaces until a meaningful character is reached.
   */
  skipWhitespace(): void {
    while (true) {
      let c = this.peek();

      switch (c) {
        case " ":
        case "\t":
        case "\r":
          // Consume that whitespace and keep looping
          this.advance();
          break;

        case "\n":
          // Increase line number on newline character
          this.line++;
          this.advance();
          break;

        case "/": {
          if (this.peekNext() === "/") {
            // Keep looping until the end of the line
            while (this.peek() !== "\n" && this.isAtEnd() === false) {
              this.advance();
            }
          } else {
            // Stop without consuming, this is a meaningful slash (/)
            return;
          }
        }

        default:
          return;
      }
    }
  }

  //#endregion
}
