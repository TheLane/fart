# Fart — полный журнал проекта

## Назначение

Этот файл — хронологический журнал проекта Fart. Здесь фиксируются не только изменения кода, но и принятые архитектурные решения, изменения спецификации, версии и важные технические события.

Правило: если решение влияет на язык, CLI, архитектуру, совместимость или пользовательский опыт, оно должно попасть сюда.

## Версионирование

Используется Semantic Versioning в форме `MAJOR.MINOR.PATCH`.

- `MAJOR` — несовместимое изменение языка/API.
- `MINOR` — новая совместимая возможность или завершение заметного этапа.
- `PATCH` — исправление ошибки, документации или внутренней реализации без изменения публичной модели языка.

До `1.0.0` формат остаётся экспериментальным, но версии всё равно повышаются последовательно.

---

## 2026-09-26 — v0.1.0 — создание проекта

### Идея

Проект появился как шутка вокруг визуального восприятия расширения `.dart`, которое было прочитано как `.fart`. Из шутки решили сделать настоящий небольшой язык программирования.

### Основная идея

**The joke is the presentation. The implementation should be serious.**

Язык должен быть реально исполняемым, тестируемым и расширяемым, а юмор в основном живёт в названии, CLI, диагностике и инструментах.

### Выбранное направление

- название: Fart;
- расширение исходных файлов: `.fart`;
- реализация первого этапа: Node.js;
- исполнение: tree-walk interpreter;
- архитектура: `.fart → Lexer → Parser → AST → Interpreter`;
- внутренние технические названия остаются обычными: Lexer, Parser, AST, Interpreter, Environment, Runtime, Token;
- публичный CLI называется `fart`.

### Начальная структура

Созданы:

- `README.md`
- `SPEC.md`
- `ROADMAP.md`
- `DESIGN.md`
- `PROJECT_LOG.md`
- `src/`
- `test/`
- `examples/`
- `docs/`

### Первоначальная версия языка

Версия спецификации: `0.1.0`.

Предварительные ключевые слова:

- `fart` — объявление функции;
- `let` — объявление переменной;
- `if` / `else` — условие;
- `while` — цикл;
- `release` — возврат значения из функции;
- `true` / `false` / `null` — базовые значения.

Базовые функции и типы:

- `smell(value)` — вывод значения;
- Number;
- String;
- Boolean;
- Null;
- Function.

### Синтаксическое направление

Выбран C/JavaScript-подобный синтаксис с фигурными скобками и точками с запятой. Цель — получить настоящий маленький язык, а не JavaScript с массово переименованными словами.

Базовая форма функции:

```fart
fart main() {
    smell("Hello, world!");
}
```

### Открытые вопросы

На момент создания проекта ещё не зафиксированы окончательно:

- обязательность точек с запятой;
- окончательный статус `release` и возможный `return`;
- массивы и объекты;
- модули;
- пакетная система;
- bytecode/VM после MVP;
- границы юмористической терминологии;
- дополнительные возможности REPL.

### Принцип развития

Сначала пишем несколько маленьких реальных программ на Fart, затем замораживаем спорные части синтаксиса. Не усложнять язык ради шутки.

---

## История версий

| Версия | Дата | Событие |
|---|---|---|
| `0.1.0` | 2026-09-26 | Инициализация проекта и базовая спецификация |

## Формат будущих записей

Для каждого значимого изменения использовать структуру:

1. дата;
2. версия;
3. что изменилось;
4. почему изменилось;
5. затронутые файлы/компоненты;
6. совместимость;
7. решение или следующий шаг.

## 2026-09-26 — v0.2.0 — Lexer

### Что сделано

- создан package.json для Node.js проекта;
- добавлены TokenType и класс Token;
- реализован Lexer;
- добавлены идентификаторы и ключевые слова;
- добавлены числа и строки;
- добавлены пунктуация и операторы;
- добавлены //-комментарии;
- добавлены позиции строки и колонки;
- добавлена ошибка LexerError;
- добавлены автоматические тесты на Node.js test runner.

### Принятые решения

release закреплён как ключевое слово возврата из функции. На уровне лексера return пока не является ключевым словом.

Лексер не содержит юмористической логики внутри себя: его задача — корректно преобразовать исходный текст в поток токенов. Юмор остаётся на уровне языка и пользовательских диагностик.

### Проверка

npm.cmd test:

- 5 тестов;
- 5 пройдено;
- 0 ошибок.

### Следующий шаг

v0.3.0 — Parser и AST. Перед реализацией парсера дополнительно зафиксируем спорные части MVP-грамматики, особенно точку с запятой и форму release.


## 2026-09-26 — v0.3.0 — Parser + AST

### Что сделано

- добавлена модель AST;
- реализован рекурсивный descent parser;
- добавлены функции, параметры, переменные и присваивания;
- добавлены if/else, while, release и блоки;
- добавлены бинарные и унарные выражения;
- добавлены литералы, переменные и вызовы функций;
- добавлены синтаксические ошибки с позицией строки и колонки;
- добавлены тесты парсера.

### Принятые решения

- в MVP выражения и объявления завершаются точкой с запятой;
- release может быть без значения: release; допустим и означает возврат без значения;
- парсер использует рекурсивный спуск и стандартные уровни приоритета операторов;
- внутренние имена AST остаются обычными техническими терминами.

### Проверка

npm.cmd test:

- 10 тестов;
- 10 пройдено;
- 0 ошибок.

### Следующий шаг

v0.4.0 — Interpreter.

## 2026-09-26 � v0.6.0 � functions and scopes

Completed the function/runtime phase. Fart now has function calls with parameters, return values through `release`, nested lexical scopes, closures and argument-count validation. Added dedicated interpreter tests; full suite: 15/15 passing.

The v0.5.0 interpreter files were also cleaned up so AST definitions live only in `src/ast.js`, runtime support in `src/runtime.js`, and execution in `src/interpreter.js`.

## 2026-09-26 � v0.7.0 � arrays

Added mutable arrays with literal syntax (`[1, 2, 3]`), zero-based indexing, element assignment, nested arrays and the `length()` built-in for arrays and strings. Added bounds/type checks and five array tests. Full suite: 20/20 passing.

Also introduced a living example gallery in `examples/` and `docs/jokes.md` for the project's terminology and recurring jokes.


## 2026-09-26 — v0.8.0 — standard library

- Extracted built-in functions into `src/stdlib.js`.
- Added numeric helpers: `abs`, `floor`, `ceil`, `round`, `sqrt`.
- Added string helpers: `upper`, `lower`, `trim`, `contains`.
- Added utility helpers: `random`, `now`, `type`, `stringify`.
- Kept conventional names in source code; Fart humor remains in the presentation and documentation.
- Added `examples/stdlib.fart` as an executable standard-library example.
- Added five standard-library tests.
- Full test suite: 25/25 passing.
- The joke remains the presentation; the implementation remains serious.
