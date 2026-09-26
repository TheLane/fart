# Fart Roadmap

## Completed

- [x] Phase 0 — Specification
- [x] Phase 1 — Project skeleton
- [x] Phase 2 — Lexer
- [x] Phase 3 — Parser + AST
- [x] Phase 4 — Tree-walk interpreter
- [x] Phase 5 — CLI + REPL
- [x] Phase 6 — Functions and scopes
- [x] Phase 7 — Arrays + living examples/jokes
- [x] Phase 8 — Standard library

## Phase 8 — Standard library

- [x] Extract standard library into src/stdlib.js
- [x] Math helpers: abs, floor, ceil, round, sqrt
- [x] String helpers: upper, lower, trim, contains
- [x] Utility helpers: random, now, type, stringify
- [x] Standard-library tests
- [x] Executable standard-library example

The standard library deliberately stays small. Conventional function names are used in code; the humorous terminology remains in documentation and presentation.

## Phase 9 — Stable MVP

- [ ] Freeze runtime semantics
- [ ] Improve runtime diagnostics
- [ ] Add more edge-case tests
- [ ] Review CLI/REPL behavior
- [ ] Document language reference
- [ ] Prepare 0.9.0

## Phase 10 — Fart 1.0

- [ ] Frozen syntax
- [ ] Documented semantics
- [ ] Stable CLI
- [ ] Standard library baseline
- [ ] Comprehensive tests
- [ ] Formatter
- [ ] High-quality diagnostics
- [ ] Examples and tutorial

## Phase 11 — The ridiculous stuff

Possible future projects:

- Fart Bag package manager
- Gas Station package registry
- Gas Inspector debugger
- Air Freshener garbage collector branding
- animated CLI messages
- web playground
- WASM target
- Fart written in Fart

## Guiding rule

**The joke is the presentation. The implementation should be serious.**

## Living examples and jokes

The examples directory is an executable gallery of the language. docs/jokes.md is the living home for Fart terminology and jokes; update it whenever new language features create new opportunities for terrible humor.
