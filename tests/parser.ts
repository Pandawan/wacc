import {
  assertEquals,
} from "https://deno.land/std@0.74.0/testing/asserts.ts";

import Lexer from "../src/lexer/lexer.ts";
import Parser from "../src/parser/parser.ts";
import {
  BoolExpression,
  InfixExpression,
  NumberExpression,
  PrefixExpression,
  StringExpression,
} from "../src/parser/ast.ts";
import { TokenType } from "../src/lexer/token.ts";

Deno.test("Parser empty", () => {
  const lexer = new Lexer("");
  const parser = new Parser(lexer);
  const [hadErrors, module] = parser.parseModule();
  assertEquals(hadErrors, false);
  assertEquals(module, []);
});

Deno.test("Parser primary number", () => {
  const lexer = new Lexer("5");
  const parser = new Parser(lexer);
  const [hadErrors, module] = parser.parseModule();
  assertEquals(hadErrors, false);
  assertEquals(module, [
    new NumberExpression(5),
  ]);
});

Deno.test("Parser primary keyword", () => {
  const lexer = new Lexer("true");
  const parser = new Parser(lexer);
  const [hadErrors, module] = parser.parseModule();
  assertEquals(hadErrors, false);
  assertEquals(module, [
    new BoolExpression(true),
  ]);
});

Deno.test("Parser primary string", () => {
  const lexer = new Lexer('"Hello World"');
  const parser = new Parser(lexer);
  const [hadErrors, module] = parser.parseModule();
  assertEquals(hadErrors, false);
  assertEquals(module, [
    new StringExpression('"Hello World"'),
  ]);
});

Deno.test("Parser simple infix", () => {
  const lexer = new Lexer("5 + 3");
  const parser = new Parser(lexer);
  const [hadErrors, module] = parser.parseModule();
  assertEquals(hadErrors, false);
  assertEquals(module, [
    new InfixExpression(
      new NumberExpression(5),
      TokenType.plus,
      new NumberExpression(3),
    ),
  ]);
});

Deno.test("Parser complex infix", () => {
  const lexer = new Lexer("5 + -3 * 5 - 2");
  const parser = new Parser(lexer);
  const [hadErrors, module] = parser.parseModule();
  assertEquals(hadErrors, false);
  assertEquals(module, [
    new InfixExpression(
      new InfixExpression(
        new NumberExpression(5),
        TokenType.plus,
        new InfixExpression(
          new PrefixExpression(TokenType.minus, new NumberExpression(3)),
          TokenType.star,
          new NumberExpression(5),
        ),
      ),
      TokenType.minus,
      new NumberExpression(2),
    ),
  ]);
});
