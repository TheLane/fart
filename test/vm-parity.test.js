import test from "node:test";
import assert from "node:assert/strict";
import { parseSource } from "../dist/cli.js";
import { Compiler } from "../dist/compiler.js";
import { VirtualMachine } from "../dist/vm.js";

function run(source) {
  const output = [];
  new VirtualMachine(text => output.push(text)).run(new Compiler().compile(parseSource(source)));
  return output;
}

test("Gas Engine short-circuits logical operators", () => {
  assert.deepEqual(run(`fart main() {
    smell(false && (1 / 0));
    smell(true || (1 / 0));
    smell(false || true);
    smell(true && false);
  }`), ["false", "true", "true", "false"]);
});

test("Gas Engine standard library works", () => {
  assert.deepEqual(run(`fart main() {
    smell(abs(-7));
    smell(upper("gas"));
    smell(contains("fart", "art"));
    smell(length([1, 2, 3]));
    smell(type([1]));
    smell(stringify([1, 2]));
  }`), ["7", "GAS", "true", "3", "array", "[1, 2]"]);
});
