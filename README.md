# Fart Programming Language

> A programming language that stinks, but runs.

Fart is a deliberately humorous programming language project. The joke is part of the language design, but the implementation is intended to be real, usable, testable, and technically interesting.

## Status

**Phase:** Specification

The first implementation target is a small interpreted language running on Node.js.

## Design goals

- Real executable programs, not just a joke syntax.
- Tiny and understandable core.
- Friendly implementation for experimentation and extension.
- Consistent humorous terminology.
- Useful error messages.
- Excellent REPL experience.
- Easy transition from interpreter to bytecode/VM later.

## First milestone

Run `fart hello.fart` and execute:

~~~fart
fart main() {
    smell("Hello, world!");
}
~~~

See SPEC.md and ROADMAP.md.
