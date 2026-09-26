# Fart Roadmap

## Phase 0 РІР‚вЂќ Specification РІР‚вЂќ NOW

- [x] Project name: Fart
- [x] `.fart` extension
- [x] Language philosophy
- [x] MVP keywords
- [x] Basic types
- [x] Operators
- [x] Functions
- [x] Initial built-ins
- [x] Error philosophy
- [x] Freeze MVP grammar
- [x] Decide semicolon policy
- [ ] Freeze runtime semantics

## Phase 1 РІР‚вЂќ Project skeleton

- [x] Initialize Node.js project
- [x] Create source tree
- [x] Add test runner
- [ ] Add CLI executable
- [ ] Add lint/format configuration
- [ ] Add first examples
- [ ] Add version command

Target: `fart --version` and `fart examples/hello.fart`.

## Phase 2 РІР‚вЂќ Lexer

- [x] Identifiers
- [x] Numbers
- [x] Strings
- [x] Punctuation and operators
- [x] Keywords
- [x] Line comments
- [x] Source line/column positions
- [x] Lexer diagnostics

Implement identifiers, numbers, strings, punctuation, operators, keywords, comments and source positions.

## Phase 3 РІР‚вЂќ Parser

- [x] Define MVP grammar
- [x] Define AST node model
- [x] Implement recursive-descent parser
- [x] Add parser diagnostics
- [x] Add parser tests

Implement AST nodes for program, functions, variables, assignment, binary/unary expressions, calls, if/else, while, return/release and blocks.

Goal: source -> tokens -> AST.

## Phase 4 РІР‚вЂќ Interpreter

Implement environments, variables, arithmetic, comparisons, boolean logic, functions, calls, conditionals, loops, return values and runtime errors.

First real demo:

~~~fart
fart main() {
    let gas = 10;
    while (gas > 0) {
        smell(gas);
        gas = gas - 1;
    }
    smell("No gas left.");
}
~~~

## Phase 5 РІР‚вЂќ CLI and REPL

Commands: `fart file.fart`, `fart repl`, `fart --help`, `fart --version`.

REPL should support multiline functions, useful errors, clean exit and history where practical.

## Phase 6 РІР‚вЂќ Standard library

Potential library: smell, string utilities, math, random, time and arrays. Keep it small.

## Phase 7 РІР‚вЂќ Developer experience

VS Code syntax highlighting, formatter, syntax checker, better diagnostics, examples and documentation.

Possible names: Fart Formatter, Gas Inspector, Fart Linter, Fart Chamber.

## Phase 8 РІР‚вЂќ Modules and packages

Only after the core language is stable.

Possible terminology: package = bag, package manager = Fart Bag, dependency = gas dependency, registry = Gas Station.

## Phase 9 РІР‚вЂќ Bytecode / VM

Optional but desirable. Pipeline: `.fart` -> lexer -> parser -> AST -> bytecode compiler -> Fart VM.

The tree-walk interpreter remains the reference implementation.

## Phase 10 РІР‚вЂќ Fart 1.0

Frozen syntax, documented semantics, comprehensive tests, stable CLI, standard library baseline, examples, formatter and good diagnostics.

## Phase 11 РІР‚вЂќ The ridiculous stuff

Package registry, Fart Bag, Air Freshener garbage collector branding, Gas Inspector debugger, animated CLI messages, web playground, WASM target and eventually Fart written in Fart.

## Guiding rule

**The joke is the presentation. The implementation should be serious.**

## Phase 6 вЂ” Functions and scopes

- [x] Function declarations
- [x] Parameters and arguments
- [x] Function calls
- [x] `release` return values
- [x] Lexical environments
- [x] Nested block scopes
- [x] Closures
- [x] Arity checks
- [x] Function runtime tests

Target: functions behave as first-class values and capture their defining environment.

## Phase 7 — Arrays

- [x] Array literals
- [x] Array indexing
- [x] Array element assignment
- [x] Nested arrays
- [x] `length()` built-in
- [x] Array runtime errors
- [x] Array examples

Target: simple mutable arrays with zero-based indexing. Objects, methods and advanced collection APIs remain outside the MVP for now.

## Living examples and jokes

The `examples/` directory is now a small executable gallery of the language. `docs/jokes.md` is the living home for Fart terminology and jokes; update it as new language features introduce new opportunities for terrible humor.
