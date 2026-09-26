import test from "node:test";
import assert from "node:assert/strict";
import { Lexer } from "../src/lexer.js";
import { Parser } from "../src/parser.js";
import { Interpreter } from "../src/interpreter.js";

function run(source) {
  const output = [];
  const program = new Parser(new Lexer(source).scanTokens()).parse();
  const interpreter = new Interpreter(value => output.push(value));
  interpreter.interpret(program);
  return { output, result: interpreter.runMain() };
}

test("calls functions with arguments and release", () => {
  const { result } = run(`fart add(a, b) { release a + b; } fart main() { release add(20, 22); }`);
  assert.equal(result, 42);
});

test("creates lexical scopes", () => {
  const { output } = run(`fart main() { let gas = 1; if (true) { let gas = 2; smell(gas); } smell(gas); }`);
  assert.deepEqual(output, ["2", "1"]);
});

test("closures capture their defining environment", () => {
  const { result } = run(`fart makeAdder(x) { fart add(y) { release x + y; } release add; } fart main() { let add5 = makeAdder(5); release add5(7); }`);
  assert.equal(result, 12);
});

test("functions without release return null", () => {
  const { result } = run(`fart noop() { smell("done"); } fart main() { release noop(); }`);
  assert.deepEqual(result, null);
});

test("reports wrong function arity", () => {
  assert.throws(() => run(`fart add(a, b) { release a + b; } fart main() { add(1); }`), /Expected 2 arguments but got 1/);
});
