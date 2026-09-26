# Fart Language Specification

**Version:** 1.1.0
**Status:** Stable

## 1. Philosophy

Fart is a small interpreted language whose terminology is intentionally ridiculous while its implementation remains conventional.

Pipeline:

`source -> Lexer -> Parser -> AST -> Interpreter`

The joke is the presentation. The implementation should be serious.

## 2. Source files

Fart source files use the `.fart` extension. Comments begin with `//` and continue to the end of the line. Statements requiring termination use semicolons.

## 3. Types

- Number
- String
- Boolean
- Null
- Function
- Array

Numbers are floating-point values. Arrays are mutable and zero-indexed.

Truthiness: `false` and `null` are false; every other value is true.

## 4. Variables

```fart
let gas = 42;
let message = "hello";
gas = gas + 1;
```

A declaration without an initializer receives `null`.

## 5. Functions and scopes

```fart
fart add(a, b) {
    release a + b;
}
```

Functions support parameters, calls, first-class values, lexical scopes and closures. A function without `release` returns `null`. `release;` is valid and returns `null`.

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

```fart
let bag = [10, 20, 30];
smell(bag[1]);
bag[1] = 99;
```

Indexes must be integers and remain within bounds. Nested arrays are supported.

## 8. Operators

Arithmetic: `+ - * /`

Comparison: `> >= < <=`

Equality: `== !=`

Logical: `&& || !`

The `+` operator accepts two numbers or two strings. Other arithmetic and comparison operators require numbers. Logical operators short-circuit.

## 9. Built-ins and standard library

Core:

- `smell(...values)` — output values
- `length(value)` — array or string length

Standard library:

- `abs`, `floor`, `ceil`, `round`, `sqrt`
- `upper`, `lower`, `trim`, `contains`
- `random`, `now`, `type`, `stringify`

## 10. Program entry point

A file run by the CLI must define `main()`:

```fart
fart main() {
    smell("Hello!");
}
```

The interpreter executes `main()` after loading the file.

The REPL does not require `main` and keeps one interpreter environment between inputs.

## 11. CLI

```text
fart <file.fart>
fart check <file.fart>
fart fmt <file.fart>
fart fmt --write <file.fart>
fart repl
fart --version
fart --help
```

`check` performs lexical and syntactic analysis without executing code.

`fmt` prints formatted source. `fmt --write` formats the file in place.

## 12. Diagnostics

Lexer and parser errors include line and column information. CLI lexer failures are presented as `FART STINK`; other failures use `FART ERROR`.

Runtime errors cover undefined variables, invalid operators, invalid indexes, division by zero and incorrect function arity.

## 13. Grammar

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

Version 1.0.0 is the stable public language baseline. Existing documented behavior should not be changed silently.

Not part of 1.0: classes, async/await, modules, static typing, macros, concurrency, native compilation and package management.
