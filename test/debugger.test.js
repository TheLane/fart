import test from "node:test";
import assert from "node:assert/strict";
import { parseSource } from "../dist/cli.js";
import { Interpreter } from "../dist/interpreter.js";
import { GasInspector } from "../dist/debugger.js";

test("Gas Inspector hooks stop on executable statement lines", () => {
  const source = `fart main() {\n  let gas = 2;\n  smell(gas);\n}`;
  const program = parseSource(source);
  const interpreter = new Interpreter(() => {});
  const inspector = new GasInspector(source);
  const stopped = [];
  inspector.prompt = line => { stopped.push(line); inspector.stepping = false; };
  inspector.start(interpreter);
  interpreter.interpret(program);
  interpreter.runMain();
  assert.deepEqual(stopped, [2]);
});

test("Gas Inspector records initial breakpoints", () => {
  const source = `fart main() {\n  let gas = 2;\n  smell(gas);\n}`;
  const interpreter = new Interpreter(() => {});
  const inspector = new GasInspector(source, [3]);
  const stopped = [];
  inspector.prompt = line => stopped.push(line);
  inspector.start(interpreter);
  inspector.stepping = false;
  const program = parseSource(source);
  interpreter.interpret(program);
  interpreter.runMain();
  assert.deepEqual(stopped, [3]);
});
