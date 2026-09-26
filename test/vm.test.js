import test from "node:test";
import assert from "node:assert/strict";
import { parseSource } from "../dist/cli.js";
import { Compiler } from "../dist/compiler.js";
import { VirtualMachine } from "../dist/vm.js";

function run(source) {
  const output = [];
  const vm = new VirtualMachine((text) => output.push(text));
  vm.run(new Compiler().compile(parseSource(source)));
  return output;
}

test("Gas Engine executes arithmetic and loops", () => {
  assert.deepEqual(run(`fart main() {
    let gas = 3;
    while (gas > 0) {
      smell(gas);
      gas = gas - 1;
    }
  }`), ["3", "2", "1"]);
});

test("Gas Engine executes functions", () => {
  assert.deepEqual(run(`fart add(a, b) {
    release a + b;
  }
  fart main() {
    smell(add(20, 22));
  }`), ["42"]);
});

test("Gas Engine executes arrays and indexing", () => {
  assert.deepEqual(run(`fart main() {
    let bag = [10, 20, 30];
    smell(bag[1]);
    bag[1] = 99;
    smell(bag[1]);
  }`), ["20", "99"]);
});
