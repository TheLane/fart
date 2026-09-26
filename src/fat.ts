import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";
import { fileURLToPath } from "node:url";
import { readManifest, type BagManifest } from "./bag.js";

export type FatKind = "fat" | "fatter";
export const FAT_FORMAT_VERSION = 1;

export interface FatBundle {
  format: "FAT" | "FATTER";
  formatVersion: number;
  name: string;
  version: string;
  main: string;
  description?: string;
  files: Record<string, string>;
  runtime?: { engine: "node"; node: string; files: Record<string, string> };
}

function safeRelative(file: string): string {
  const normalized = file.replace(/\\/g, "/");
  if (!normalized || normalized.startsWith("/") || normalized.split("/").includes("..")) {
    throw new Error("FAT bundle contains an unsafe path: " + file);
  }
  return normalized;
}

function collectFiles(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const ignored = new Set([".git", "node_modules", "dist", "build", "coverage"]);
  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ignored.has(entry.name) || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        const rel = safeRelative(path.relative(root, full));
        if (rel.endsWith(".fart") || rel === "fart.json") result[rel] = fs.readFileSync(full).toString("base64");
      }
    }
  }
  walk(root);
  if (!result["fart.json"]) throw new Error("FAT build needs fart.json in the project root.");
  return result;
}
function collectRuntime(): Record<string, string> {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
  const files: Record<string, string> = {};
  if (!fs.existsSync(root)) return files;
  for (const name of fs.readdirSync(root)) {
    if (name.endsWith(".js")) files["dist/" + name] = fs.readFileSync(path.join(root, name)).toString("base64");
  }
  return files;
}

function manifestFor(root: string): BagManifest {
  return readManifest(root);
}

export function buildFat(projectDir = process.cwd(), kind: FatKind = "fat", outputDir?: string): string {
  const root = path.resolve(projectDir);
  const manifest = manifestFor(root);
  const main = manifest.main ?? "main.fart";
  const files = collectFiles(root);
  if (!files[main]) throw new Error("FAT build cannot find main file: " + main);
  const bundle: FatBundle = {
    format: kind === "fatter" ? "FATTER" : "FAT",
    formatVersion: FAT_FORMAT_VERSION,
    name: manifest.name,
    version: manifest.version,
    main,
    ...(manifest.description ? { description: manifest.description } : {}),
    files
  };
  if (kind === "fatter") bundle.runtime = { engine: "node", node: process.version, files: collectRuntime() };
  const out = path.resolve(outputDir ?? path.join(root, "build"));
  fs.mkdirSync(out, { recursive: true });
  const target = path.join(out, manifest.name + "." + kind);
  fs.writeFileSync(target, JSON.stringify(bundle, null, 2) + "\n", "utf8");
  return target;
}
export function readFat(file: string): FatBundle {
  let bundle: FatBundle;
  try { bundle = JSON.parse(fs.readFileSync(file, "utf8")) as FatBundle; }
  catch (error) { throw new Error("Invalid FAT bundle: " + (error instanceof Error ? error.message : String(error))); }
  if ((bundle.format !== "FAT" && bundle.format !== "FATTER") || bundle.formatVersion !== FAT_FORMAT_VERSION) {
    throw new Error("Unsupported FAT bundle format.");
  }
  if (!bundle.name || !bundle.version || !bundle.main || typeof bundle.files !== "object") {
    throw new Error("Invalid FAT bundle metadata.");
  }
  for (const fileName of Object.keys(bundle.files)) safeRelative(fileName);
  safeRelative(bundle.main);
  return bundle;
}

export function unpackFat(file: string, targetDir: string): FatBundle {
  const bundle = readFat(file);
  const root = path.resolve(targetDir);
  fs.mkdirSync(root, { recursive: true });
  for (const [name, encoded] of Object.entries(bundle.files)) {
    const target = path.join(root, name);
    if (!path.resolve(target).startsWith(root + path.sep) && path.resolve(target) !== root) throw new Error("Unsafe FAT path: " + name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(encoded, "base64"));
  }
  return bundle;
}

export function runFat(file: string, output = console.log): void {
  const bundle = readFat(file);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "fart-fat-"));
  try {
    unpackFat(file, temp);
    const source = fs.readFileSync(path.join(temp, bundle.main), "utf8");
    const tokens = new Lexer(source).scanTokens();
    const program = new Parser(tokens).parse();
    const interpreter = new Interpreter(output);
    interpreter.interpret(program);
    interpreter.runMain();
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

export function fatHelp(): string {
  return [
    "FAT — the Fart application bundle format.",
    "",
    "  fart build [dir]             Build a .fat bundle",
    "  fart build --fat [dir]       Build a .fat bundle",
    "  fart build --fatter [dir]    Build a .fatter bundle with runtime snapshot",
    "  fart run <file.fat>          Run a FAT bundle",
    "",
    "FAT is a portable Fart project bundle. FATTER additionally carries a",
    "snapshot of the Fart runtime. Both currently require Node.js to run.",
  ].join("\n");
}
