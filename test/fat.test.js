import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildFat, readFat, runFat, unpackFat } from "../dist/fat.js";
import { initBag } from "../dist/bag.js";

function tempDir(prefix) { return fs.mkdtempSync(path.join(os.tmpdir(), prefix)); }

test("buildFat creates a runnable FAT bundle", () => {
  const project = tempDir("fart-fat-");
  initBag(project);
  fs.writeFileSync(path.join(project, "main.fart"), 'fart main() { smell("FAT FART"); }\n', "utf8");
  const output = buildFat(project, "fat");
  assert.equal(output.endsWith(".fat"), true);
  const bundle = readFat(output);
  assert.equal(bundle.format, "FAT");
  assert.equal(bundle.main, "main.fart");
});
test("runFat executes a FAT bundle", async () => {
  const project = tempDir("fart-fat-");
  initBag(project);
  fs.writeFileSync(path.join(project, "main.fart"), "fart main() { smell(40 + 2); }\n", "utf8");
  const output = buildFat(project, "fat");
  const lines = [];
  await runFat(output, value => lines.push(String(value)));
  assert.deepEqual(lines, ["42"]);
});

test("FATTER carries and uses a runtime snapshot", async () => {
  const project = tempDir("fart-fatter-");
  initBag(project);
  fs.writeFileSync(path.join(project, "main.fart"), 'fart main() { smell("snapshot"); }\n', "utf8");
  const output = buildFat(project, "fatter");
  const bundle = readFat(output);
  assert.equal(bundle.format, "FATTER");
  assert.equal(bundle.runtime?.engine, "node");
  assert.ok(Object.keys(bundle.runtime?.files ?? {}).length > 0);
  const lines = [];
  await runFat(output, value => lines.push(String(value)));
  assert.deepEqual(lines, ["snapshot"]);
});
test("unpackFat restores source files", () => {
  const project = tempDir("fart-fat-");
  initBag(project);
  fs.writeFileSync(path.join(project, "main.fart"), "fart main() { smell(7); }\n", "utf8");
  const output = buildFat(project);
  const target = tempDir("fart-unpack-");
  unpackFat(output, target);
  assert.equal(fs.existsSync(path.join(target, "main.fart")), true);
  assert.equal(fs.existsSync(path.join(target, "fart.json")), true);
});
