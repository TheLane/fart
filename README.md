# Fart Programming Language

> A programming language that stinks, but runs.

Fart is a deliberately humorous programming language with a real interpreter,
lexer, parser, runtime, standard library, CLI and test suite.

## Status

**Stable MVP — v0.9.0**

The language runs on Node.js and uses the pipeline:

`source -> lexer -> parser -> AST -> interpreter`

The joke is the presentation. The implementation is serious.

## Quick start

Requirements: Node.js 20+.

Run a program:

```text
fart examples/hello.fart
```

Check syntax without executing:

```text
fart check examples/hello.fart
```

Start the REPL:

```text
fart repl
```

Show the version:

```text
fart --version
```

## Example

```fart
fart main() {
    let gas = [10, 20, 30];
    smell("Gas bag:", gas);
    release gas[1] + 22;
}
```

## Core features

- variables and assignment
- numbers, strings, booleans and null
- arithmetic, comparison and logical operators
- if/else and while
- functions, parameters, closures and release
- arrays and indexing
- built-in `smell` and `length`
- standard library helpers
- REPL and syntax checking
- line/column diagnostics
- 32 automated tests

See [SPEC.md](SPEC.md) for the language reference and [ROADMAP.md](ROADMAP.md)
for the development history.
