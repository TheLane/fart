import test from "node:test";
import assert from "node:assert/strict";
import { formatSource } from "../dist/formatter.js";

test("formats a compact program", () => {
  const source = "fart main(){let gas=1+2;if(gas>1){smell(gas);}}";
  const expected = [
    "fart main() {",
    "    let gas = 1 + 2;",
    "    if (gas > 1) {",
    "        smell(gas);",
    "    }",
    "}"
  ].join("\n") + "\n";
  assert.equal(formatSource(source), expected);
});

test("keeps comments", () => {
  const source = "// hello\nfart main(){smell(1); // output\n}";
  const formatted = formatSource(source);
  assert.match(formatted, /\/\/ hello/);
  assert.match(formatted, /smell\(1\);  \/\/ output/);
});
