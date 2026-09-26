# Fart Language Specification

**Version:** 0.9.0  
**Status:** Stable MVP

## 1. Philosophy

Fart is a small interpreted language whose terminology is intentionally
ridiculous while its implementation remains conventional.

The implementation pipeline is:

`source -> Lexer -> Parser -> AST -> Interpreter`

User-facing terminology is humorous, but internal implementation terms such as
Lexer, Parser, AST, Environment and Interpreter remain standard.

## 2. Source files

Fart source files use the `.fart` extension.

Comments begin with `//` and continue to the end of the line.

Statements and declarations end with a semicolon where the grammar specifies one.

## 3. Types

The MVP supports:

- Number
- String
- Boolean
- Null
- Function
- Array

Numbers are JavaScript-style floating-point numbers.

Arrays are mutable and zero-indexed.

Truthiness: `false` and `null` are false; every other value is true.

## 4. Variables

```fart
let gas = 42;
let message = "hello";
gas = gas + 1;
```

A declaration without an initializer receives `null`.
## 5. Functions

Functions are declared with the `fart` keyword.

```fart
fart add(a, b) {
    release a + b;
}
```

Functions may be assigned to variables and passed as values.

A function without `release` returns `null`.

`release;` is valid and also returns `null`.

Functions use lexical scoping and can form closures.

## 6. Conditions and loops

```fart
if (gas > 10) {
    smell("too much gas");
} else {
    smell("fine");
}

while (gas < 100) {
    gas = gas + 1;
}
```

## 7. Arrays

Array literals use square brackets:

```fart
let bag = [10, 20, 30];
smell(bag[1]);
bag[1] = 99;
```

Indexes must be integers and remain within bounds.

Nested arrays are supported.

## 8. Operators

Arithmetic: `+ - * /`

Comparison: `> >= < <=`

Equality: `== !=`

Logical: `&& || !`

Arithmetic and comparison operands must have compatible numeric types.
The `+` operator accepts two numbers or two strings.

Logical operators short-circuit.
## 9. Built-ins and standard library

Core built-ins:

- `smell(...values)` — output values
- `length(value)` — length of an array or string

Standard library:

- `abs`, `floor`, `ceil`, `round`, `sqrt`
- `upper`, `lower`, `trim`, `contains`
- `random`, `now`, `type`, `stringify`

## 10. Program entry point

A source file executed with the CLI is expected to define:

```fart
fart main() {
    // program
}
```

The CLI executes `main()` after the source has been interpreted.

The REPL does not require a `main` function and keeps one interpreter
environment across inputs.

## 11. CLI

```text
fart <file.fart>
fart check <file.fart>
fart repl
fart --version
fart --help
```

`fart check` performs lexical and syntactic analysis without executing code.

Successful checking prints:

```text
No stink detected. Syntax is clean.
```
## 12. Diagnostics

Lexer and parser errors include line and column information.

The CLI presents lexer failures as `FART STINK` and other failures as
`FART ERROR`.

Runtime errors include useful messages such as undefined variables, invalid
operators, invalid indexes, division by zero and incorrect function arity.

## 13. MVP grammar

```text
program -> declaration* EOF

declaration -> functionDeclaration | statement

functionDeclaration -> "fart" IDENTIFIER "(" parameters? ")" block
parameters -> IDENTIFIER ("," IDENTIFIER)*

statement -> letStatement | ifStatement | whileStatement
           | releaseStatement | block | expressionStatement

letStatement -> "let" IDENTIFIER ("=" expression)? ";"
ifStatement -> "if" "(" expression ")" statement ("else" statement)?
whileStatement -> "while" "(" expression ")" statement
releaseStatement -> "release" expression? ";"
block -> "{" declaration* "}"
expressionStatement -> expression ";"

expression -> assignment
assignment -> IDENTIFIER "=" assignment | index "=" assignment | logicalOr
logicalOr -> logicalAnd ("||" logicalAnd)*
logicalAnd -> equality ("&&" equality)*
equality -> comparison (("==" | "!=") comparison)*
comparison -> term ((">" | ">=" | "<" | "<=") term)*
term -> factor (("+" | "-") factor)*
factor -> unary (("*" | "/") unary)*
unary -> ("!" | "-") unary | call
call -> primary (("(" arguments? ")") | ("[" expression "]"))*
primary -> NUMBER | STRING | true | false | null | IDENTIFIER
          | arrayLiteral | "(" expression ")"
arrayLiteral -> "[" (expression ("," expression)*)? "]"
arguments -> expression ("," expression)*
```

## 14. Stability boundary

Version 0.9.0 freezes the current MVP semantics as the baseline for 1.0 work.
New features may be added before 1.0, but existing documented behavior should
not be changed casually.

Not part of the MVP: classes, async/await, modules, static typing, macros,
concurrency, native compilation and package management.
