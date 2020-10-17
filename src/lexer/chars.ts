export const enum CharCode {
  tab = "\t",
  lineFeed = "\n",
  carriageReturn = "\r",
  space = " ",
  bang = "!",
  quote = '"',
  percent = "%",
  amp = "&",
  leftParen = "(",
  rightParen = ")",
  semicolon = ";",
  star = "*",
  plus = "+",
  comma = ",",
  minus = "-",
  dot = ".",
  slash = "/",

  zero = "0",
  nine = "9",

  colon = ":",
  less = "<",
  equal = "=",
  greater = ">",
  question = "?",

  upperA = "A",
  upperF = "F",
  upperZ = "Z",

  leftBracket = "[",
  backslash = "\\",
  rightBracket = "]",
  caret = "^",
  underscore = "_",

  lowerA = "a",
  lowerF = "f",
  lowerX = "x",
  lowerZ = "z",

  leftBrace = "{",
  pipe = "|",
  rightBrace = "}",
  tilde = "~",
}

/**
 * Whether or not the given character represents a digit.
 * @param char 
 */
export function isDigit(char: string): boolean {
  return char >= CharCode.zero && char <= CharCode.nine;
}

/**
 * Whether or not the given character represents a letter or underscore (_).
 * @param char 
 */
export function isAlpha(char: string): boolean {
  return (
    char >= CharCode.lowerA && char <= CharCode.lowerZ ||
    char >= CharCode.upperA && char <= CharCode.upperZ ||
    char === CharCode.underscore
  );
}

/**
 * Whether or not the given character represents a digit, letter, or underscore (_).
 * @param char 
 */
export function isAlphanumeric(char: string): boolean {
  return isAlpha(char) || isDigit(char);
}
