import test from "node:test";
import assert from "node:assert/strict";
import { Lexer } from "../dist/lexer.js";
import { Parser } from "../dist/parser.js";
import { Interpreter } from "../dist/interpreter.js";

function run(source) {
  const output = [];
  const program = new Parser(new Lexer(source).scanTokens()).parse();
  const interpreter = new Interpreter(value => output.push(value));
  interpreter.interpret(program);
  return { output, result: interpreter.runMain() };
}

test("math built-ins work", () => {
  const { result } = run(`fart main() { release sqrt(81) + abs(-2) + floor(3.9) + ceil(2.1) + round(2.6); }`);
  assert.equal(result, 20);
});

test("string built-ins work", () => {
  const { result } = run(`fart main() { release upper(trim("  hello  ")) + lower("WORLD"); }`);
  assert.equal(result, "HELLOworld");
});

test("contains and type work", () => {
  const { result } = run(`fart main() { release contains("smelly fart", "fart") && type([1, 2]) == "array"; }`);
  assert.equal(result, true);
});

test("stringify converts values", () => {
  const { result } = run(`fart main() { release stringify([1, "gas", true]); }`);
  assert.equal(result, "[1, gas, true]");
});

test("stdlib reports bad argument types", () => {
  assert.throws(
    () => run(`fart main() { release sqrt("gas"); }`),
    /sqrt needs a number/
  );
});
