import {
  assertEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";

import Lexer from "../src/lexer/lexer.ts";
import { TokenType } from "../src/lexer/token.ts";

Deno.test("Lexer empty", () => {
  const lexer = new Lexer("");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.eof);
});

Deno.test("Lexer single-character token", () => {
  const lexer = new Lexer("(");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.leftParen);
  assertEquals(token.lexeme, "(");
});

Deno.test("Lexer double-character token", () => {
  const lexer = new Lexer("!=");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.bangEqual);
  assertEquals(token.lexeme, "!=");
});

Deno.test("Lexer number token", () => {
  const lexer = new Lexer("123.456");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.number);
  assertEquals(token.lexeme, "123.456");
});

Deno.test("Lexer string token", () => {
  const lexer = new Lexer('"Hello World"');
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.string);
  assertEquals(token.lexeme, '"Hello World"');
});

Deno.test("Lexer keyword token", () => {
  const lexer = new Lexer("if");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.if);
  assertEquals(token.lexeme, "if");
});

Deno.test("Lexer identifier token", () => {
  const lexer = new Lexer("_myIdentifier");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.identifier);
  assertEquals(token.lexeme, "_myIdentifier");
});

Deno.test("Lexer comment", () => {
  const lexer = new Lexer("// Some comment");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.eof);
});

Deno.test("Lexer invalid", () => {
  const lexer = new Lexer("#");
  const token = lexer.scanToken();
  assertEquals(token.type, TokenType.error);
  assertEquals(token.lexeme, "Unexpected character '#'.");
});
