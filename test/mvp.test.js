import test from "node:test";
import assert from "node:assert/strict";
import { Interpreter } from "../src/interpreter.js";
import { Lexer } from "../src/lexer.js";
import { Parser } from "../src/parser.js";
import { execute, check } from "../src/cli.js";

function run(source) {
  const output = [];
  const program = new Parser(new Lexer(source).scanTokens()).parse();
  const interpreter = new Interpreter(value => output.push(value));
  interpreter.interpret(program);
  return { result: interpreter.runMain(), output };
}

test("check validates syntax without running", () => {
  assert.equal(check("fart main() { release 42; }"), true);
});

test("release without a value returns null", () => {
  assert.equal(run("fart main() { release; }").result, null);
});

test("short circuit avoids the right side", () => {
  const source = "fart main() { let gas = false; gas && missing(); release gas || true; }";
  assert.equal(run(source).result, true);
});

test("empty arrays and strings are valid", () => {
  const source = `fart main() { let a = []; let s = ""; release length(a) + length(s); }`;
  assert.equal(run(source).result, 0);
});

test("nested indexing works", () => {
  assert.equal(run("fart main() { let a = [[10, 20], [30, 40]]; release a[1][0]; }").result, 30);
});

test("division by zero is a runtime error", () => {
  assert.throws(() => execute("fart main() { release 10 / 0; }"), /Division by zero/);
});

test("wrong function arity is a runtime error", () => {
  assert.throws(() => execute("fart main() { fart add(a) { release a; } release add(); }"), /Expected 1 arguments but got 0/);
});

