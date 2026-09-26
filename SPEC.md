# Fart Language Specification

Version: 0.2.0

## 1. Identity

Name: Fart
Extension: `.fart`
CLI: `fart`
Implementation language: Node.js
Initial execution model: tree-walk interpreter

Tagline: **Fart — a programming language that stinks, but runs.**

The language should be funny in its vocabulary without making the implementation unnecessarily complicated.

## 2. Core principles

1. A valid Fart program must be executable.
2. Syntax should be small enough to learn in one sitting.
3. Humorous vocabulary should remain internally consistent.
4. Ordinary programming concepts remain recognizable underneath the joke.
5. Errors should be memorable but technically useful.
6. The language must be deterministic and easy to test.

## 3. Source files

UTF-8 text with the `.fart` extension.

Comments initially use `//`.

## 4. Program entry point

Conventional entry point:

~~~fart
fart main() {
    smell("Hello, world!");
}
~~~

The interpreter executes `main()` when it exists.

## 5. Keywords

Initial set:

- `fart` — function declaration
- `let` — variable declaration
- `if` — conditional
- `else` — alternative branch
- `while` — loop
- `release` — return a value from a function
- `true`
- `false`
- `null`

## 6. Built-ins

`smell(value)` prints a value to standard output.

`release(value)` is the planned humorous return form; the lexer reserves `release` as a keyword.

Example:

~~~fart
fart add(a, b) {
    release a + b;
}
~~~

## 7. Types

MVP types:

- Number
- String
- Boolean
- Null
- Function

Planned later: Array and Object.

Example:

~~~fart
let gas = 42;
let message = "too much gas";
let active = true;
let nothing = null;
~~~

## 8. Expressions

Arithmetic: `+ - * /`

Comparison: `== != < <= > >=`

Logical: `&& || !`

Parentheses control precedence.

## 9. Statements

Variable declaration:

~~~fart
let gas = 10;
~~~

Assignment:

~~~fart
gas = gas + 1;
~~~

Conditional:

~~~fart
if (gas > 10) {
    smell("TOO MUCH GAS!");
} else {
    smell("Gas level acceptable.");
}
~~~

Loop:

~~~fart
while (gas < 10) {
    gas = gas + 1;
}
~~~

Function:

~~~fart
fart add(a, b) {
    release a + b;
}
~~~

## 10. Function calls

~~~fart
let result = add(2, 3);
smell(result);
~~~

Functions are intended to be first-class values.

## 11. Truthiness

For MVP:

- `false` is false.
- `null` is false.
- Everything else is true.

This may be revised before 1.0.

## 12. Runtime terminology

| Technical concept | Fart terminology |
|---|---|
| Variable | gas |
| Function | fart |
| Return | release |
| Output | smell |
| Error | stink |
| Exception | explosion |
| Loop | wind |
| Package | bag |
| Dependency | gas dependency |
| Compiler | Fart Compiler |
| Runtime | Fart Chamber |
| Debugger | Gas Inspector |
| Garbage collector | Air Freshener |

These are project terminology, not necessarily all language keywords.

## 13. Errors

Errors must contain useful technical information.

Example:

~~~text
FART ERROR
Something stinks at line 12, column 7.

Expected expression, found '}'

  12 |     smell(;
                 ^
~~~

Runtime errors may use `FART STINK` followed by the real cause and source location.

## 14. CLI

Initial commands:

- `fart file.fart`
- `fart repl`
- `fart --version`
- `fart --help`

Possible future commands: `fart check`, `fart format`, `fart compile`, `fart run`.

## 15. REPL

Example:

~~~text
Fart REPL v0.1
Ready to release some code.

fart> smell("hello")
hello
~~~

Startup text should be configurable or suppressible for scripting.

## 16. Grammar direction

Target expression grammar:

~~~text
program -> declaration*
declaration -> functionDeclaration | statement
statement -> variableDeclaration | ifStatement | whileStatement | returnStatement | expressionStatement | block
expression -> assignment | logicalOr | logicalAnd | equality | comparison | term | factor | unary | call | primary
~~~

The exact grammar will be frozen after the lexer/parser prototype.

## 17. Non-goals for MVP

Do not initially implement classes, async/await, modules, package registry, native compilation, static types, macros or concurrency.

## 18. Compatibility

Fart 0.x may change syntax. Starting with 1.0, syntax changes require a documented language version.

## 19. Testing

Every feature needs tests for valid syntax, runtime behavior, invalid syntax and useful error location/message.

Executable examples live under `examples/`.

## 20. Open design questions

- Is `release` the only return keyword, or should `return` remain available?
- Is `smell` the only standard output function?
- Array/object syntax?
- Module syntax?
- Package manager naming?
- Bytecode/VM strategy?
- How far should humorous terminology extend into tooling?
- Are semicolons mandatory?
- Do we want automatic semicolon insertion?