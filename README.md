# Fart Programming Language

> A real programming language that stinks, but runs.

**[GitHub repository](https://github.com/TheLane/fart)** В· **[Р СѓСЃСЃРєР°СЏ РІРµСЂСЃРёСЏ РЅРёР¶Рµ](#СЂСѓСЃСЃРєР°СЏ-РІРµСЂСЃРёСЏ)**

[English](#fart-programming-language) | [Р СѓСЃСЃРєРёР№](#СЂСѓСЃСЃРєР°СЏ-РІРµСЂСЃРёСЏ)

Fart is a deliberately humorous programming language with a real interpreter,
lexer, parser, runtime, standard library, CLI, formatter and test suite.

## Status

**Stable 1.3.0**

The implementation is written in TypeScript and runs on Node.js. The language uses:

`source -> lexer -> parser -> AST -> interpreter`

The joke is the presentation. The implementation is serious.

## Quick start

Requirements: Node.js 20+.

Run a program:

~~~text
fart examples/hello.fart
~~~

Check syntax without executing:

~~~text
fart check examples/hello.fart
~~~

Format source:

~~~text
fart fmt examples/hello.fart
fart fmt --write examples/hello.fart
~~~

Start the REPL:

~~~text
fart repl
~~~

Show the version:

~~~text
fart --version
~~~

## Example

~~~fart
fart main() {
    let gas = [10, 20, 30];
    smell("Gas bag:", gas);
    release gas[1] + 22;
}
~~~

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
- formatter
- line/column diagnostics
- Fart Bag local package manager groundwork
- 37 automated tests

See [SPEC.md](SPEC.md) for the language reference,
[docs/tutorial.md](docs/tutorial.md) for the beginner tutorial,
[docs/bag.md and docs/gas-station.md](docs/bag.md) for Fart Bag, and
[ROADMAP.md](ROADMAP.md) for project history.

## Project rule

**The joke is the presentation. The implementation should be serious.**

## Р СѓСЃСЃРєР°СЏ РІРµСЂСЃРёСЏ

> Fart вЂ” РЅР°СЃС‚РѕСЏС‰РёР№ СЏР·С‹Рє РїСЂРѕРіСЂР°РјРјРёСЂРѕРІР°РЅРёСЏ, РєРѕС‚РѕСЂС‹Р№ РІРѕРЅСЏРµС‚, РЅРѕ СЂР°Р±РѕС‚Р°РµС‚.

Fart вЂ” СЌРєСЃРїРµСЂРёРјРµРЅС‚Р°Р»СЊРЅС‹Р№ С€СѓС‚РѕС‡РЅС‹Р№ СЏР·С‹Рє РїСЂРѕРіСЂР°РјРјРёСЂРѕРІР°РЅРёСЏ СЃ РЅР°СЃС‚РѕСЏС‰РёРј Р»РµРєСЃРµСЂРѕРј, РїР°СЂСЃРµСЂРѕРј, AST, РёРЅС‚РµСЂРїСЂРµС‚Р°С‚РѕСЂРѕРј, СЃС‚Р°РЅРґР°СЂС‚РЅРѕР№ Р±РёР±Р»РёРѕС‚РµРєРѕР№, REPL, С„РѕСЂРјР°С‚С‚РµСЂРѕРј Рё С‚РµСЃС‚Р°РјРё.

РџСЂРѕРµРєС‚ РЅР°РїРёСЃР°РЅ РЅР° Node.js. РђСЂС…РёС‚РµРєС‚СѓСЂР°:

`РёСЃС…РѕРґРЅС‹Р№ РєРѕРґ -> lexer -> parser -> AST -> interpreter`

### Р‘С‹СЃС‚СЂС‹Р№ СЃС‚Р°СЂС‚

РўСЂРµР±СѓРµС‚СЃСЏ Node.js 20+.

```text
fart examples/hello.fart
fart check examples/hello.fart
fart fmt examples/hello.fart
fart repl
fart bag init
fart bag list
```

### Р§С‚Рѕ СѓР¶Рµ СѓРјРµРµС‚ Fart

- РїРµСЂРµРјРµРЅРЅС‹Рµ Рё РїСЂРёСЃРІР°РёРІР°РЅРёРµ
- С‡РёСЃР»Р°, СЃС‚СЂРѕРєРё, boolean Рё null
- Р°СЂРёС„РјРµС‚РёС‡РµСЃРєРёРµ, СЃСЂР°РІРЅРёС‚РµР»СЊРЅС‹Рµ Рё Р»РѕРіРёС‡РµСЃРєРёРµ РѕРїРµСЂР°С‚РѕСЂС‹
- `if/else` Рё `while`
- С„СѓРЅРєС†РёРё, РїР°СЂР°РјРµС‚СЂС‹, Р·Р°РјС‹РєР°РЅРёСЏ Рё `release`
- РјР°СЃСЃРёРІС‹ Рё РёРЅРґРµРєСЃР°С†РёСЏ
- `smell`, `length` Рё СЃС‚Р°РЅРґР°СЂС‚РЅР°СЏ Р±РёР±Р»РёРѕС‚РµРєР°
- REPL Рё РїСЂРѕРІРµСЂРєР° СЃРёРЅС‚Р°РєСЃРёСЃР°
- С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ РёСЃС…РѕРґРЅРѕРіРѕ РєРѕРґР°
- РґРёР°РіРЅРѕСЃС‚РёРєР° СЃ РЅРѕРјРµСЂР°РјРё СЃС‚СЂРѕРє Рё СЃС‚РѕР»Р±С†РѕРІ
- Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРёРµ С‚РµСЃС‚С‹

Р”РѕРєСѓРјРµРЅС‚Р°С†РёСЏ: [SPEC.md](SPEC.md), [СѓС‡РµР±РЅРёРє](docs/tutorial.md), [ROADMAP.md](ROADMAP.md).

**РЁСѓС‚РєР° вЂ” РІ РїРѕРґР°С‡Рµ. Р РµР°Р»РёР·Р°С†РёСЏ вЂ” РІСЃРµСЂСЊС‘Р·.**

### Р РµРїРѕР·РёС‚РѕСЂРёР№

в­ђ [github.com/TheLane/fart](https://github.com/TheLane/fart) вЂ” РёСЃС…РѕРґРЅС‹Р№ РєРѕРґ, РґРѕРєСѓРјРµРЅС‚Р°С†РёСЏ, РїСЂРёРјРµСЂС‹ Рё РёСЃС‚РѕСЂРёСЏ РїСЂРѕРµРєС‚Р°.
