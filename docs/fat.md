# FAT и FATTER

FAT — формат упаковки приложения Fart.

## FAT

Команда:

```text
fart build --fat
```

Создаёт `build/<name>.fat`. В пакет входят `fart.json` и исходные `.fart` файлы.

## FATTER

Команда:

```text
fart build --fatter
```

Создаёт `build/<name>.fatter`. Помимо проекта пакет содержит снимок собранного Fart runtime.

## Запуск

```text
fart run build/my-fart.fat
fart run build/my-fart.fatter
```

Запуск распаковывает пакет во временный каталог, запускает его `main` и удаляет временные файлы после завершения.

Оба формата на версии 1.6.0 требуют Node.js. FATTER — задел для будущего полностью автономного Fart runtime.

## Терминология

- FAT — обычный пакет приложения.
- FATTER — более тяжёлый пакет с runtime snapshot.
- FAT FART — собранное приложение Fart.
- FATTER FART — максимально упакованный вариант.

Шутка — в названии. Формат — настоящий и тестируемый.
