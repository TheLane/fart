import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { initBag, installBag, listBags, readManifest } from "../src/bag.js";

function tempDir(prefix) { return fs.mkdtempSync(path.join(os.tmpdir(), prefix)); }

test("bag init creates a valid fart.json", () => {
  const dir = tempDir("fart-bag-");
  const manifest = initBag(dir);
  assert.equal(manifest.version, "0.1.0");
  assert.deepEqual(manifest.dependencies, {});
  assert.deepEqual(readManifest(dir), manifest);
});

test("bag install copies a local package and records the dependency", () => {
  const project = tempDir("fart-project-");
  const packageDir = tempDir("fart-package-");
  initBag(project);
  const packageManifest = initBag(packageDir);
  fs.writeFileSync(path.join(packageDir, "main.fart"), "fart main() { release 42; }\n", "utf8");
  const result = installBag(packageDir, project);
  assert.equal(result.manifest.name, packageManifest.name);
  assert.equal(fs.existsSync(path.join(project, "fart_modules", packageManifest.name, "main.fart")), true);
  const projectManifest = readManifest(project);
  assert.equal(projectManifest.dependencies[packageManifest.name], "file:" + path.resolve(packageDir));
});

test("bag list finds installed packages", () => {
  const project = tempDir("fart-project-");
  const packageDir = tempDir("fart-package-");
  initBag(project);
  initBag(packageDir);
  installBag(packageDir, project);
  const result = listBags(project);
  assert.equal(result.names.length, 1);
  assert.equal(result.names[0], readManifest(packageDir).name);
});
