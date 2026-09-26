# Fart Roadmap

## Phase 0 — Specification — NOW

- [x] Project name: Fart
- [x] `.fart` extension
- [x] Language philosophy
- [x] MVP keywords
- [x] Basic types
- [x] Operators
- [x] Functions
- [x] Initial built-ins
- [x] Error philosophy
- [ ] Freeze MVP grammar
- [ ] Decide semicolon policy
- [ ] Freeze runtime semantics

## Phase 1 — Project skeleton

- [ ] Initialize Node.js project
- [ ] Create source tree
- [ ] Add CLI executable
- [ ] Add test runner
- [ ] Add lint/format configuration
- [ ] Add first examples
- [ ] Add version command

Target: `fart --version` and `fart examples/hello.fart`.

## Phase 2 — Lexer

Implement identifiers, numbers, strings, punctuation, operators, keywords, comments and source positions.

## Phase 3 — Parser

Implement AST nodes for program, functions, variables, assignment, binary/unary expressions, calls, if/else, while, return/release and blocks.

Goal: source -> tokens -> AST.

## Phase 4 — Interpreter

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

## Phase 5 — CLI and REPL

Commands: `fart file.fart`, `fart repl`, `fart --help`, `fart --version`.

REPL should support multiline functions, useful errors, clean exit and history where practical.

## Phase 6 — Standard library

Potential library: smell, string utilities, math, random, time and arrays. Keep it small.

## Phase 7 — Developer experience

VS Code syntax highlighting, formatter, syntax checker, better diagnostics, examples and documentation.

Possible names: Fart Formatter, Gas Inspector, Fart Linter, Fart Chamber.

## Phase 8 — Modules and packages

Only after the core language is stable.

Possible terminology: package = bag, package manager = Fart Bag, dependency = gas dependency, registry = Gas Station.

## Phase 9 — Bytecode / VM

Optional but desirable. Pipeline: `.fart` -> lexer -> parser -> AST -> bytecode compiler -> Fart VM.

The tree-walk interpreter remains the reference implementation.

## Phase 10 — Fart 1.0

Frozen syntax, documented semantics, comprehensive tests, stable CLI, standard library baseline, examples, formatter and good diagnostics.

## Phase 11 — The ridiculous stuff

Package registry, Fart Bag, Air Freshener garbage collector branding, Gas Inspector debugger, animated CLI messages, web playground, WASM target and eventually Fart written in Fart.

## Guiding rule

**The joke is the presentation. The implementation should be serious.**
