export const enum TokenType {
  // Single-character tokens.
  leftParen = "leftParen",
  rightParen = "rightParen",
  leftBrace = "leftBrace",
  rightBrace = "rightBrace",
  comma = "comma",
  dot = "dot",
  minus = "minus",
  plus = "plus",
  semicolon = "semicolon",
  slash = "slash",
  star = "star",

  // One or two character tokens.
  bang = "bang",
  bangEqual = "bangEqual",
  equal = "equal",
  equalEqual = "equalEqual",
  greater = "greater",
  greaterEqual = "greaterEqual",
  less = "less",
  lessEqual = "lessEqual",

  // Literals.
  identifier = "identifier",
  string = "string",
  number = "number",

  // Keywords.
  and = "and",
  class = "class",
  else = "else",
  false = "false",
  fn = "fn",
  for = "for",
  if = "if",
  null = "null",
  or = "or",
  print = "print",
  return = "return",
  super = "super",
  this = "this",
  true = "true",
  var = "var",
  while = "while",

  error = "error",
  eof = "eof",
}

export default interface Token {
  type: TokenType;
  lexeme: string;

  start: number;
  length: number;
  line: number;
}
