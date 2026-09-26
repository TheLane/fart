# Fart Programming Language

> A real programming language that stinks, but runs.

**[GitHub repository](https://github.com/TheLane/fart)** · **[Русская версия ниже](#русская-версия)**

[English](#fart-programming-language) | [Русский](#русская-версия)

Fart is a deliberately humorous programming language with a real interpreter,
lexer, parser, runtime, standard library, CLI, formatter and test suite.

## Status

**Stable 1.6.0**

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
- Gas Station package registry
- Gas Inspector debugger
- TypeScript implementation
- FAT/FATTER application bundles
- Gas Station and Gas Inspector tooling
- 44 automated tests

See [SPEC.md](SPEC.md) for the language reference,
[docs/tutorial.md](docs/tutorial.md) for the beginner tutorial,
[docs/bag.md](docs/bag.md), [docs/gas-station.md](docs/gas-station.md), [docs/gas-inspector.md](docs/gas-inspector.md), and [docs/fat.md](docs/fat.md) for Fart Bag, Gas Station, and Gas Inspector, and
[ROADMAP.md](ROADMAP.md) for project history.

## Project rule

**The joke is the presentation. The implementation should be serious.**

## Русская версия

> Fart — настоящий язык программирования, который воняет, но работает.

Fart — экспериментальный шуточный язык программирования с настоящим лексером, парсером, AST, интерпретатором, стандартной библиотекой, REPL, форматтером и тестами.

Проект написан на Node.js. Архитектура:

`исходный код -> lexer -> parser -> AST -> interpreter`

### Быстрый старт

Требуется Node.js 20+.

```text
fart examples/hello.fart
fart check examples/hello.fart
fart fmt examples/hello.fart
fart repl
fart bag init
fart bag list
fart station
fart inspect examples/hello.fart
fart build --fat
fart build --fatter
fart run build/my-fart.fat
```

### Что уже умеет Fart

- переменные и присваивание
- числа, строки, boolean и null
- арифметические, сравнительные и логические операторы
- `if/else` и `while`
- функции, параметры, замыкания и `release`
- массивы и индексация
- `smell`, `length` и стандартная библиотека
- REPL и проверка синтаксиса
- форматирование исходного кода
- диагностика с номерами строк и столбцов
- автоматические тесты
- Gas Station и удалённая установка пакетов
- Gas Inspector для пошаговой отладки
- FAT/FATTER для упаковки приложений

Документация: [SPEC.md](SPEC.md), [учебник](docs/tutorial.md), [ROADMAP.md](ROADMAP.md).

**Шутка — в подаче. Реализация — всерьёз.**

Текущая версия: **1.6.0**.

### Репозиторий

⭐ [github.com/TheLane/fart](https://github.com/TheLane/fart) — исходный код, документация, примеры и история проекта.
