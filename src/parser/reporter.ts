import Token, { TokenType } from "../lexer/token.ts";

export interface Reporter {
  hadError: boolean;

  error(message: string, token: Token): void;
  warn(message: string, token: Token): void;
}

interface JsonIssue {
  message: string;
  token: Token;
  severity: "error" | "warning";
}

export class JsonReporter implements Reporter {
  private issues: JsonIssue[];

  public get hadError(): boolean {
    return this.issues.length !== 0;
  }

  constructor() {
    this.issues = [];
  }

  error(
    message: string,
    token: Token,
  ): void {
    this.issues.push({
      severity: "error",
      message,
      token,
      // TODO: Add source/path where the token occurs, this should be stored in the token directly (through the lexer)
    });
  }

  warn(message: string, token: Token) {
    this.issues.push({
      severity: "warning",
      message,
      token,
      // TODO: Add source/path where the token occurs, this should be stored in the token directly (through the lexer)
    });
  }

  getIssues(): JsonIssue[] {
    return this.issues;
  }
}

export class PrettyReporter implements Reporter {
  private _hadError: boolean;

  public get hadError(): boolean {
    return this._hadError;
  }

  constructor() {
    this._hadError = false;
  }

  error(message: string, token: Token) {
    const lineReporting = `[line ${token.line}]`;

    let tokenReporting = null;
    if (token.type === TokenType.eof) {
      tokenReporting = " at end of file";
    } else if (token.type === TokenType.error) {
      // Don't put an "at" for scanner errors
    } else {
      tokenReporting = ` at '${token.lexeme}'`;
    }

    console.error(`${lineReporting} Error${tokenReporting ?? ""}: ${message}`);
    this._hadError = true;
  }

  warn(message: string, token: Token) {
    const lineReporting = `[line ${token.line}]`;
    const tokenReporting = token.type === TokenType.eof
      ? `end of file`
      : (token.type === TokenType.error ? "" : token.lexeme);

    console.error(`${lineReporting} Warning at ${tokenReporting}: ${message}`);
    this._hadError = true;
  }
}
