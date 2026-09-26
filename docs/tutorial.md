# Fart 1.0 — Tutorial

Fart is a small interpreted language. Its syntax is deliberately familiar:
curly braces, semicolons and operators make the language easy to read while
the terminology provides the joke.

## 1. Your first fart

Create `hello.fart`:

~~~fart
fart main() {
    smell("Hello, world!");
}
~~~

Run it:

~~~text
fart hello.fart
~~~

## 2. Variables

~~~fart
fart main() {
    let gas = 42;
    gas = gas + 8;
    smell(gas);
}
~~~

`let` creates a variable. In the joke vocabulary, variables are gas.

## 3. Conditions

~~~fart
fart main() {
    let gas = 12;

    if (gas > 10) {
        smell("Too much gas!");
    } else {
        smell("The chamber is fine.");
    }
}
~~~

## 4. Loops

~~~fart
fart main() {
    let gas = 3;

    while (gas > 0) {
        smell(gas);
        gas = gas - 1;
    }
}
~~~

## 5. Functions and release

~~~fart
fart add(a, b) {
    release a + b;
}

fart main() {
    smell(add(20, 22));
}
~~~

`release` returns a value from a function.

## 6. Arrays

~~~fart
fart main() {
    let bag = ["small", "medium", "large"];
    smell(bag[1]);
    bag[1] = "VERY MEDIUM";
    smell(bag);
}
~~~

Arrays are zero-indexed and mutable.

## 7. Standard library

~~~fart
fart main() {
    smell(upper("fresh gas"));
    smell(sqrt(81));
    smell(length([1, 2, 3]));
}
~~~

The standard library includes numeric, string and utility helpers. See `SPEC.md`
for the complete list.

## 8. Check before running

Use:

~~~text
fart check hello.fart
~~~

A successful check reports:

~~~text
No stink detected. Syntax is clean.
~~~

## 9. Format your code

Print formatted code:

~~~text
fart fmt hello.fart
~~~

Format the file in place:

~~~text
fart fmt --write hello.fart
~~~

## 10. REPL

Start:

~~~text
fart repl
~~~

Useful commands:

- `.help`
- `.version`
- `.exit`

The REPL keeps one interpreter environment, so definitions can be reused in
later inputs.

## 11. Where to go next

Read `SPEC.md` for exact syntax and semantics, browse `examples/` for runnable
programs, and read `docs/jokes.md` for the official terminology.

Remember the project rule:

**The joke is the presentation. The implementation should be serious.**
