import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { startStation, publishBag, searchBags, installRemoteBag } from "../dist/station.js";

test("Gas Station publishes, searches and installs a bag", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fart-station-"));
  const packageDir = path.join(root, "hello-bag");
  const projectDir = path.join(root, "project");
  fs.mkdirSync(packageDir, { recursive: true });
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(path.join(packageDir, "fart.json"), JSON.stringify({
    name: "hello-bag", version: "1.0.0", description: "A tiny test bag", main: "main.fart", dependencies: {}
  }, null, 2));
  fs.writeFileSync(path.join(packageDir, "main.fart"), "fart hello() { release 42; }\n");
  fs.writeFileSync(path.join(projectDir, "fart.json"), JSON.stringify({
    name: "test-project", version: "0.1.0", dependencies: {}
  }, null, 2));

  const port = 4874 + Math.floor(Math.random() * 1000);
  const server = startStation(port, path.join(root, "registry"));
  try {
    const url = "http://127.0.0.1:" + port;
    const published = await publishBag(packageDir, url);
    assert.equal(published.name, "hello-bag");
    const found = await searchBags(url, "hello");
    assert.equal(found.length, 1);
    const installed = await installRemoteBag("hello-bag", url, projectDir);
    assert.equal(installed.version, "1.0.0");
    assert.equal(fs.existsSync(path.join(projectDir, "fart_modules", "hello-bag", "main.fart")), true);
  } finally {
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(root, { recursive: true, force: true });
  }
});
