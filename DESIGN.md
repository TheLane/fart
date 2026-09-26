# Fart Design Notes

## Central idea

Fart should feel like a genuine small programming language that happens to have an absurd identity.

The first version should be closer to a tiny JavaScript/Python/Lox-style language than to a parody syntax generator.

## Why Node.js?

The development environment already has Node.js and the user is comfortable with Node/Vue projects.

Advantages: fast iteration, easy CLI distribution, simple testing, future web playground and straightforward packaging.

## Interpreter first

Do not start with a compiler. A tree-walk interpreter gives faster language experimentation, simpler debugging, easier error messages and a reference semantic implementation.

If the language survives the joke, bytecode/VM can follow.

## Naming

Use normal technical names internally: Lexer, Parser, AST, Interpreter, Environment, Runtime and Token.

Use Fart terminology in user-facing surfaces where it improves the joke. This keeps implementation maintainable.

## Personality

The project should have a strong identity without becoming unreadable.

Good: `FART ERROR: unexpected token`

Bad: an error that is only a joke and does not tell the developer what went wrong.

## First demo

The first impressive demo should demonstrate variables, functions, arithmetic, conditionals, loops and output while remaining small enough to understand without a manual.
