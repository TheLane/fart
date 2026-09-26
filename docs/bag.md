# Fart Bag

Fart Bag is the package-management foundation introduced in Fart 1.1.0.
The first version deliberately keeps the registry out of the picture: packages are
installed from local directories so the package format can stabilize before the
Gas Station registry arrives.

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
