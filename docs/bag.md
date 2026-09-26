# Fart Bag

Fart Bag is the package-management foundation introduced in Fart 1.1.0. Fart 1.3.0 adds the first Gas Station registry and network package workflow.
Local installation remains supported, while the new Gas Station workflow adds network publishing, search, and installation.

## Package manifest

A Fart package contains a `fart.json` file:

```json
{
  "name": "my-fart-package",
  "version": "0.1.0",
  "main": "main.fart",
  "dependencies": {}
}
```

## Commands

```text
fart bag init
fart bag install ../some-package
fart bag list
```

`bag init` creates a manifest. `bag install` copies a local package into
`fart_modules/<name>` and records a `file:` dependency. `bag list` shows the
installed bags.

## Why local first?

This gives Fart a real package layout without pretending that a public registry
already exists. The next package milestone can add the Gas Station registry and
network resolution without changing the basic manifest format.
