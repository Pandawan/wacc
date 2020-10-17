import Token, { TokenType } from "./token.ts";

const KEYWORDS: { [str: string]: TokenType } = {
  "class": TokenType.CLASS,
  "else": TokenType.ELSE,
  "false": TokenType.FALSE,
  "fn": TokenType.FN,
  "for": TokenType.FOR,
  "if": TokenType.IF,
  "null": TokenType.NULL,
  "print": TokenType.PRINT,
  "return": TokenType.RETURN,
  "super": TokenType.SUPER,
  "this": TokenType.THIS,
  "true": TokenType.TRUE,
  "var": TokenType.VAR,
  "while": TokenType.WHILE,
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
      return this.makeToken(TokenType.EOF);
    }

    let c = this.advance();

    // Don't want to switch over all possible characters, so match them early here
    if (this.isAlpha(c)) return this.makeIdentifierOrKeyword();
    if (this.isDigit(c)) return this.makeNumber();

    switch (c) {
      case "(":
        return this.makeToken(TokenType.LEFT_PAREN);
      case ")":
        return this.makeToken(TokenType.RIGHT_PAREN);
      case "{":
        return this.makeToken(TokenType.LEFT_BRACE);
      case "}":
        return this.makeToken(TokenType.RIGHT_BRACE);
      case ",":
        return this.makeToken(TokenType.COMMA);
      case ".":
        return this.makeToken(TokenType.DOT);
      case "-":
        return this.makeToken(TokenType.MINUS);
      case "+":
        return this.makeToken(TokenType.PLUS);
      case ";":
        return this.makeToken(TokenType.SEMICOLON);
      case "/":
        return this.makeToken(TokenType.SLASH);
      case "*":
        return this.makeToken(TokenType.STAR);

      case "!":
        return this.makeToken(
          this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG,
        );
      case "=":
        return this.makeToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
        );
      case "<":
        return this.makeToken(
          this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS,
        );
      case ">":
        return this.makeToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
        );

      case '"':
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
      type: TokenType.ERROR,
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
    return this.makeToken(TokenType.STRING);
  }

  /**
   * Make a number token.
   * Assumes the leading digit has already been consumed.
   */
  makeNumber(): Token {
    // Keep consuming digits
    while (this.isDigit(this.peek())) this.advance();

    // Look for fractional part
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      // Consume the dot (.)
      this.advance();

      // Keep consuming fractional digits
      while (this.isDigit(this.peek())) this.advance();
    }

    return this.makeToken(TokenType.NUMBER);
  }

  /**
   * Make an identifier or keyword token.
   * Assumes the leading alpha has already been consumed.
   * (These two types are grouped because they are both scanned in a similar fashion).
   */
  makeIdentifierOrKeyword(): Token {
    // Keep consuming alpha (letters and underscore) or digits
    while (this.isAlpha(this.peek()) || this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for keyword that matches the current lexeme, otherwise it's an identifier
    const tokenType = KEYWORDS[
      this.source.substring(this.start, this.current)
    ] ?? TokenType.IDENTIFIER;

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

  //#region Character Determiner

  /**
   * Whether or not the given character represents a digit.
   * @param char 
   */
  isDigit(char: string): boolean {
    // Regex to test for a single digit character.
    return /^\d$/.test(char);
  }

  // TODO: Either export these regexes outside of the function so they're not compiled every function call, or find a non-regex way.
  /**
   * Whether or not the given character represents a letter or underscore (_).
   * @param char 
   */
  isAlpha(char: string): boolean {
    return /^[a-z]|[A-Z]|_$/.test(char);
  }

  //#endregion
}
