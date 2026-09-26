import fs from "node:fs";
import path from "node:path";
export const MANIFEST = "fart.json";

function packageName(dir) {
  const name = path.basename(path.resolve(dir)).toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
  return name || "my-fart-package";
}

export function manifestPath(dir) { return path.join(path.resolve(dir), MANIFEST); }

export function readManifest(dir) {
  const file = manifestPath(dir);
  if (!fs.existsSync(file)) throw new Error("No fart.json found in " + path.resolve(dir));
  let data;
  try { data = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error("Invalid fart.json: " + error.message); }
  if (!data.name || typeof data.name !== "string") throw new Error("fart.json needs a package name.");
  if (!data.version || typeof data.version !== "string") throw new Error("fart.json needs a package version.");
  if (data.dependencies !== undefined && (typeof data.dependencies !== "object" || Array.isArray(data.dependencies))) {
    throw new Error("fart.json dependencies must be an object.");
  }
  return data;
}

export function initBag(dir = process.cwd()) {
  const root = path.resolve(dir);
  const file = manifestPath(root);
  if (fs.existsSync(file)) throw new Error("fart.json already exists.");
  const manifest = { name: packageName(root), version: "0.1.0", main: "main.fart", dependencies: {} };
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return manifest;
}

export function installBag(source, projectDir = process.cwd()) {
  const sourceDir = path.resolve(source);
  const manifest = readManifest(sourceDir);
  const destination = path.join(path.resolve(projectDir), "fart_modules", manifest.name);
  if (path.resolve(sourceDir) === path.resolve(projectDir)) throw new Error("A package cannot install itself.");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(sourceDir, destination, { recursive: true, filter: (src) => !src.includes(`${path.sep}.git${path.sep}`) });
  const projectManifest = readManifest(projectDir);
  projectManifest.dependencies ??= {};
  projectManifest.dependencies[manifest.name] = "file:" + sourceDir;
  fs.writeFileSync(manifestPath(projectDir), JSON.stringify(projectManifest, null, 2) + "\n", "utf8");
  return { manifest, destination };
}

export function listBags(projectDir = process.cwd()) {
  const manifest = readManifest(projectDir);
  const modulesDir = path.join(path.resolve(projectDir), "fart_modules");
  const names = fs.existsSync(modulesDir)
    ? fs.readdirSync(modulesDir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort()
    : [];
  return { manifest, names };
}

export function bagHelp() {
  return [
    "Fart Bag — the Fart package manager.",
    "",
    "  fart bag init [dir]       Create fart.json",
    "  fart bag install <dir>   Install a local Fart package",
    "  fart bag list             List installed bags",
  ].join("\n");
}

export function isBagCommand(args) { return args[0] === "bag"; }
