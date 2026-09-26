# Gas Inspector

Gas Inspector is the interactive debugger for Fart programs.

## Start

```text
fart inspect examples/hello.fart
```

You can stop on a specific source line with:

```text
fart inspect examples/hello.fart --break 4
```

The inspector starts in step mode and pauses before executable statements.

## Commands

| Command | Short | Meaning |
|---|---|---|
| `continue` | `c` | Continue until the next breakpoint |
| `next` | `n` | Execute the current statement and stop again |
| `break <line>` | `b <line>` | Add a line breakpoint |
| `clear <line>` | | Remove a breakpoint |
| `print <gas>` | `p <gas>` | Print a variable |
| `locals` | `l` | Show variables in the current environment |
| `stack` | `s` | Show the Fart call stack |
| `list` | | Show source around the current line |
| `quit` | `q` | Exit the inspector |

## Example session

```text
inspect> print gas
3
inspect> next
inspect> locals
{ gas: 2 }
inspect> continue
```

Gas Inspector is intentionally implemented as a small layer around the
interpreter's debug hooks. It does not change Fart program semantics.
