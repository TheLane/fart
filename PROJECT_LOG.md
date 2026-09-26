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

## 2026-09-26 — v0.6.0 — functions and scopes

Completed the function/runtime phase. Fart now has function calls with parameters, return values through `release`, nested lexical scopes, closures and argument-count validation. Added dedicated interpreter tests; full suite: 15/15 passing.

The v0.5.0 interpreter files were also cleaned up so AST definitions live only in `src/ast.js`, runtime support in `src/runtime.js`, and execution in `src/interpreter.js`.

## 2026-09-26 — v0.7.0 — arrays

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

## 2026-09-26 — v0.9.0 — Stable MVP

### Что сделано

- зафиксирован MVP как стабильная база перед 1.0;
- обновлена CLI до версии 0.9.0;
- добавлена команда `fart check <file>` для лексической и синтаксической проверки без запуска;
- CLI-диагностика теперь показывает тип ошибки и line/column;
- REPL получил `.version` и сохраняет один Interpreter между вводами;
- обновлены README и SPEC.md до фактически реализованного языка;
- добавлены edge-case тесты для release без значения, short-circuit, пустых массивов
  и строк, вложенной индексации, деления на ноль и неверной арности;
- полный набор: 32/32 теста.

### Проверка

Проверены:

- `npm.cmd test` — 32/32;
- `fart --version` — 0.9.0;
- `fart check examples/hello.fart` — синтаксис корректен;
- реальный запуск `examples/hello.fart` — 3, 2, 1.

### Решение

v0.9.0 становится стабильным MVP-базисом для подготовки Fart 1.0.
Следующий крупный этап — стабилизация публичного синтаксиса, форматтер,
расширенная диагностика и учебная документация.
## 2026-09-26 — v1.0.0 — first stable release

### Completed

- Public MVP syntax and semantics frozen.
- CLI updated to 1.0.0.
- Added `fart fmt <file>` and `fart fmt --write <file>`.
- Formatter preserves `//` comments.
- Added formatter tests.
- Updated the language specification to 1.0.0.
- Added `docs/tutorial.md` for beginners.
- Updated README and roadmap.
- Full suite: 34/34 tests passing.

### Verification

- `npm.cmd test` — 34/34.
- `fart --version` — 1.0.0.
- `fart check examples/hello.fart` — syntax valid.
- `fart fmt examples/hello.fart` — formatting works.
- `examples/hello.fart` — executes successfully.

### Decision

Fart 1.0.0 is the stable language baseline. Future changes should preserve
this documented behavior or use normal Semantic Versioning when compatibility changes.

## 2026-09-26 — v1.2.0 — миграция реализации на TypeScript

- `src/*.js` заменены на TypeScript.
- Добавлены типизированные Token, AST и runtime boundaries.
- Сборка теперь идёт через `tsc` в `dist/`.
- CLI и тесты переведены на собранный runtime.
- Все 37 тестов сохранены и проходят.

2026-09-26 — v1.1.0 — Fart Bag groundwork

- Repository made public on GitHub.
- README expanded with English/Russian presentation and direct repository links.
- GitHub description and discovery topics configured.
- MIT license added.
- package metadata now contains keywords, repository, homepage, and issue tracker.
- Fart Bag introduced as a local package-manager foundation.
- `fart bag init`, `fart bag install <dir>`, and `fart bag list` added.
- Local packages use `fart.json` and install into `fart_modules`.
- Added Fart Bag documentation and automated tests.
- Full test suite: 37/37.


## 2026-09-27 — v1.4.1 — documentation encoding and Gas Inspector docs

- Repaired corrupted Russian text in README and project history.
- Verified project text files as UTF-8.
- Added dedicated Gas Inspector documentation.
- Updated SPEC and ROADMAP to reflect Fart 1.4.

## 2026-09-27 — v1.4.0 — Gas Inspector

### Что сделано

- Добавлен Gas Inspector — интерактивный пошаговый отладчик Fart.
- Добавлены точки останова по строкам исходного кода.
- Добавлены команды `continue`, `next`, `break`, `clear`, `print`, `locals`, `stack`, `list` и `quit`.
- Интерпретатор получил debug hooks и отслеживание вызовов функций.
- AST statement nodes получили номера исходных строк для точной остановки.
- Добавлены команды CLI `fart inspect <file>` и `fart inspect <file> --break <line>`.
- Реализация и документация сохраняются в UTF-8.

### Проверка

- Полный набор: 38/38 тестов.
- Ручная проверка `fart inspect examples/hello.fart` показала корректную остановку и приглашение Gas Inspector.

### Следующий этап

Следующий крупный этап — Air Freshener: усиление типизации TypeScript, постепенное включение strict mode и повышение качества внутренних API без изменения пользовательского синтаксиса.


## 2026-09-27 — v1.5.0 — Air Freshener / strict TypeScript

### Что сделано

- Включён `strict` mode TypeScript.
- Включены `noUncheckedIndexedAccess` и `exactOptionalPropertyTypes`.
- Убраны неявные `any` из interpreter, formatter и standard library.
- Добавлены явные типы для RuntimeValue, AST и callback boundaries.
- Усилена типобезопасность индексации массивов и параметров функций.
- Добавлены тесты Gas Inspector.
- Полный набор: 40/40 тестов.

### Решение

Внутренний TypeScript-код теперь собирается в полном strict mode. Пользовательский синтаксис Fart не изменён.


## 2026-09-27 — v1.6.0 — FAT/FATTER application bundles

### Что сделано

- Добавлен формат FAT (`.fat`) для переносимой упаковки приложения Fart.
- Добавлен формат FATTER (`.fatter`) со снимком собранного runtime.
- Добавлены команды `fart build --fat` и `fart build --fatter`.
- Добавлена команда `fart run <file.fat|file.fatter>`.
- Реализованы безопасная проверка путей, упаковка, распаковка и временный запуск.
- Добавлены автоматические тесты FAT/FATTER.
- Полный набор: 44/44 теста.

### Решение

FAT и FATTER становятся официальной частью терминологии Fart. FAT — переносимый пакет исходников приложения; FATTER — расширенный пакет со снимком runtime. Полностью автономный runtime пока остаётся следующим этапом.


## 2026-09-27 — v1.7.0 — self-contained FATTER runtime

### Что сделано

- FATTER теперь действительно запускает Fart из runtime snapshot, встроенного в пакет.
- Запуск FATTER больше не использует установленные `lexer.js`, `parser.js` и `interpreter.js` текущего Fart.
- Runtime snapshot распаковывается во временный каталог и загружается как отдельные ES modules.
- Добавлена проверка выполнения FATTER через автоматический тест.
- FAT продолжает использовать обычный локальный runtime.
- Полный набор: 44/44 теста.

### Решение

FATTER становится самодостаточным именно на уровне Fart runtime: для запуска по-прежнему нужен Node.js, но версия установленного Fart на машине больше не имеет значения.


## 2026-09-27 — v1.9.0 — semantic parity для Gas Engine

### Что сделано

- Добавлен short-circuit для `&&` и `||` на уровне bytecode.
- В VM перенесена стандартная библиотека: математические, строковые функции, `contains`, `random`, `now`, `type`, `stringify` и `length`.
- Добавлены отдельные parity-тесты для логических операторов и стандартной библиотеки.
- Полный набор тестов: 49/49.
- Обычный interpreter остаётся эталонным runtime.

### Следующий технический рубеж

Закрыть оставшийся разрыв по семантике: прежде всего closures и корректные lexical environments в VM. После этого можно добавлять disassembler и реальные бенчмарки.

## 2026-09-27 — v1.8.0 — bytecode compiler и Gas Engine VM

### Что сделано

- Добавлен байткод с явным набором инструкций.
- Добавлен `Compiler`, преобразующий AST в bytecode.
- Добавлен стековый `VirtualMachine` с кадрами вызовов функций.
- Добавлены операции арифметики, сравнений, переходов, циклов, функций, массивов и индексации.
- Добавлена специальная VM-операция `smell`.
- Добавлена команда `fart vm <file>` для экспериментального запуска.
- Tree-walk interpreter сохранён как эталонная реализация семантики.
- Добавлены VM-тесты; полный набор: 47/47.

### Архитектурное решение

VM пока экспериментальная и не заменяет обычный interpreter по умолчанию. Следующая задача — добиться семантического паритета по языковым возможностям, включая short-circuit, стандартную библиотеку и замыкания, а затем измерить производительность.
