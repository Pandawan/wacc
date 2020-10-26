# WACC

A tiny programming language implemented in TypeScript that compiles to WASM.

## Notes & Resources

### General

- [Build your own WebAssembly Compiler](https://blog.scottlogic.com/2019/05/17/webassembly-compiler.html)

### Lexer

- [Wrenalayzer Lexer](https://github.com/munificent/wrenalyzer/blob/master/lexer.wren)
- [Crafting Interpreters C Scanner](https://craftinginterpreters.com/scanning-on-demand.html)
  - [Wren Compiler](https://github.com/wren-lang/wren/blob/main/src/vm/wren_compiler.c)
- [Kaleidoscope LLVM Lexer](https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl01.html)
- [Lisperator JS Token Stream Lexer](http://lisperator.net/pltut/parser/token-stream)
- [Suneido.js Lexer TS Implementation](https://github.com/apmckinlay/suneido.js/blob/master/runtime/lexer.ts)
- [Handwritten JS Lexer](https://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones)

### Parser

Thinking of doing simple recursive descent parser with pratt parsing.

- [Wren Parser](https://github.com/munificent/wrenalyzer/blob/master/parser.wren)
- [Crafting Interpreters Java Parser](https://craftinginterpreters.com/parsing-expressions.html)
- [Otto - js parser in golang](https://github.com/robertkrimen/otto/tree/master/parser)
  - Really nice parser and easy to read through
- [Rapidus - js parser in rust](https://github.com/maekawatoshiki/rapidus)
  - I've noticed most parsers on GitHub don't handle multiple error reporting, they just report the first error and stop.
  - I'm going to keep going with CraftingInterpreter's "Synchronize" approach because it handles multi-error reporting quite nicely.
- [Ianertson video Make a compiler: parsing](https://www.youtube.com/watch?v=I5PWv5OBZms)
  - YT Series writing a compiler from start to finish in C, good to see implementation and thought process
  - Code can be found on [GitHub](https://github.com/sebbekarlsson/hello)
- [Crafting Interpreters C Parser/Compiler](https://craftinginterpreters.com/compiling-expressions.html)
  - This is nice but I don't want the bytecode conversion part
- [Stack Overflow Building a Parser](https://stackoverflow.com/questions/9452584/building-a-parser-part-i)

  - Gives a high level overview of recursive descent with pratt parsing.

- [Simple but Powerful Pratt Parsing](https://matklad.github.io/2020/04/13/simple-but-powerful-pratt-parsing.html)

  - Has an interesting/different approach to pratt parsing using "power" instead of "precedence," making it easier to reason with.

- [Making a Pratt Parser Generator](https://www.robertjacobson.dev/designing-a-pratt-parser-generator)
  - Shows another way to implement pratt parsing using a table (this is the approach that CraftingInterpreters takes).
- [Stlab Simple Lexical Analyzer or Parser](http://stlab.cc/legacy/how-to-write-a-simple-lexical-analyzer-or-parser.html)
- [Top Down Operator Precedence](http://crockford.com/javascript/tdop/tdop.html)
- [Just write the #!%/\* parser](https://tiarkrompf.github.io/notes/?/just-write-the-parser/)

### Compiler / Emitter

- [Writing WebAssembly By Hand](https://blog.scottlogic.com/2018/04/26/webassembly-by-hand.html)
- [WASM Manual](https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md)
- [UTF-8 Validation](https://lemire.me/blog/2020/10/20/ridiculously-fast-unicode-utf-8-validation/)
  - Haven't looked too much into it, but if WASM requires custom string encoding, I could perhaps do this (unless JS has some utility functions for this?)
