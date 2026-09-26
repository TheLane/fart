# Gas Engine VM

Gas Engine is the experimental bytecode backend of Fart 1.8.0.

## Pipeline

`source -> lexer -> parser -> AST -> compiler -> bytecode -> Gas Engine VM`

The existing tree-walk Interpreter remains the reference runtime while VM
semantics are being brought to parity.

## Run

~~~text
fart vm examples/hello.fart
~~~

## Current VM coverage

- constants, booleans and null;
- arithmetic and comparisons;
- unary operators;
- if/else and while;
- global variables and assignments;
- function calls and parameters;
- release/return values;
- arrays and indexing;
- the smell output operation.

## Deliberate limitations

The VM is experimental. Short-circuit logical operators, the full standard
library, closures and some runtime edge cases are not yet compiled by the VM.

The normal `fart <file>` command continues to use the reference interpreter.

## Next work

Bring language semantics to parity, then add bytecode disassembly,
benchmarks, profiling and VM optimizations before considering making it the
default runtime.
