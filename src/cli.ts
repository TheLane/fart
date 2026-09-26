#!/usr/bin/env node
import fs from "node:fs";
import readline from "node:readline";
import { pathToFileURL } from "node:url";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";
import { formatSource } from "./formatter.js";
import { bagHelp, initBag, installBag, listBags } from "./bag.js";
import { publishBag, searchBags, installRemoteBag, startStation } from "./station.js";
import { GasInspector } from "./debugger.js";
import { buildFat, fatHelp, runFat } from "./fat.js";
import { Compiler } from "./compiler.js";
import { VirtualMachine } from "./vm.js";

export const VERSION = "1.8.0";
export const DEFAULT_STATION = "http://127.0.0.1:4873";

export function parseSource(source: string) {
  const tokens = new Lexer(source).scanTokens();
  return new Parser(tokens).parse();
}

export function execute(source: string, output = console.log, runMain = true, interpreter: Interpreter | null = null) {
  const program = parseSource(source);
  const runtime = interpreter ?? new Interpreter(output);
  runtime.interpret(program);
  return runMain ? runtime.runMain() : runtime;
}

export function check(source: string): true {
  parseSource(source);
  return true;
}

function formatError(error: any): string {
  const kind = error.name === "LexerError" ? "FART STINK" : "FART ERROR";
  const position = error.line ? ` at line ${error.line}, column ${error.column}` : "";
  return `${kind}${position}: ${error.message}`;
}

function printHelp(): void {
  console.log("Fart — a programming language that stinks, but runs.");
  console.log("");
  console.log("Usage:");
  console.log("  fart <file.fart>              Run a Fart program");
  console.log("  fart check <file>             Check syntax without running");
  console.log("  fart fmt <file>               Format a Fart program");
  console.log("  fart fmt --write <file>       Format file in place");
  console.log("  fart bag init [dir]            Create fart.json");
  console.log("  fart bag install <dir>         Install a local Fart package");
  console.log("  fart bag publish [dir]         Publish a bag to Gas Station");
  console.log("  fart bag search [query]        Search Gas Station");
  console.log("  fart bag list                  List installed bags");
  console.log("  fart station [port]            Start a local Gas Station");
  console.log("  fart inspect <file> [--break N] Debug with Gas Inspector");
  console.log("  fart vm <file>                 Run with the experimental Gas Engine VM");
  console.log("  fart build [--fat|--fatter] [dir] Build a FAT/FATTER bundle");
  console.log("  fart run <file.fat|file.fatter> Run a FAT bundle");
  console.log("  fart repl                      Start the Fart REPL");
  console.log("  fart --version                 Show version");
  console.log("  fart --help                    Show this help");
  console.log("");
  console.log(fatHelp());
  console.log("");
  console.log("Environment:");
  console.log("  FART_STATION_URL               Gas Station URL (default: " + DEFAULT_STATION + ")");
  console.log("");
  console.log("REPL commands:");
  console.log("  .help  .version  .exit");
}

async function repl(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "fart> " });
  const interpreter = new Interpreter();
  console.log("Fart REPL v" + VERSION);
  console.log("Type .help for commands, .exit to leave.");
  rl.prompt();
  for await (const line of rl) {
    const input = line.trim();
    if (input === ".exit") { rl.close(); break; }
    if (input === ".help") { console.log(".help  .version  .exit"); rl.prompt(); continue; }
    if (input === ".version") { console.log(VERSION); rl.prompt(); continue; }
    if (!input) { rl.prompt(); continue; }
    try { execute(input, console.log, false, interpreter); }
    catch (error) { console.error(formatError(error)); }
    rl.prompt();
  }
}

function formatFile(file: string, write: boolean): void {
  if (!fs.existsSync(file)) throw new Error("File not found: " + file);
  const source = fs.readFileSync(file, "utf8");
  const formatted = formatSource(source);
  if (write) fs.writeFileSync(file, formatted, "utf8");
  else process.stdout.write(formatted);
}

function stationUrl(): string {
  return process.env.FART_STATION_URL ?? DEFAULT_STATION;
}

async function bagCommand(args: string[]): Promise<number> {
  const command = args[1];
  if (!command || command === "--help" || command === "-h") { console.log(bagHelp()); return 0; }
  if (command === "init") {
    const manifest = initBag(args[2] ?? process.cwd());
    console.log("Bag created: " + manifest.name + "@" + manifest.version);
    return 0;
  }
  if (command === "install") {
    if (!args[2]) throw new Error("bag install needs a package directory or bag name.");
    if (fs.existsSync(args[2])) {
      const result = installBag(args[2]);
      console.log("Bag installed: " + result.manifest.name + "@" + result.manifest.version);
    } else {
      const result = await installRemoteBag(args[2], stationUrl());
      console.log("Bag installed from Gas Station: " + result.name + "@" + result.version);
    }
    return 0;
  }
  if (command === "publish") {
    const result = await publishBag(args[2] ?? process.cwd(), stationUrl());
    console.log("Bag published: " + result.name + "@" + result.version);
    return 0;
  }
  if (command === "search") {
    const results = await searchBags(stationUrl(), args.slice(2).join(" "));
    if (!results.length) { console.log("No bags found."); return 0; }
    for (const pkg of results) console.log(pkg.name + "@" + pkg.version + (pkg.description ? " — " + pkg.description : ""));
    return 0;
  }
  if (command === "list") {
    const result = listBags();
    console.log(result.manifest.name + "@" + result.manifest.version);
    for (const name of result.names) console.log("  " + name);
    return 0;
  }
  throw new Error("Unknown bag command: " + command);
}

export async function main(args = process.argv.slice(2)): Promise<number> {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") { printHelp(); return 0; }
  if (args[0] === "--version" || args[0] === "-v") { console.log(VERSION); return 0; }
  if (args[0] === "repl") { await repl(); return 0; }
  if (args[0] === "vm") {
    const file=args[1];
    if(!file){console.error("FART ERROR: vm needs a .fart file.");return 1;}
    if(!fs.existsSync(file)){console.error("FART ERROR: File not found: "+file);return 1;}
    try{const program=parseSource(fs.readFileSync(file,"utf8")),chunk=new Compiler().compile(program);new VirtualMachine(console.log).run(chunk);return 0;}catch(error){console.error(formatError(error));return 1;}
  }
  if (args[0] === "inspect") {
    const file=args[1];
    if(!file){console.error("FART ERROR: inspect needs a .fart file.");return 1;}
    if(!fs.existsSync(file)){console.error("FART ERROR: File not found: "+file);return 1;}
    const breaks=[];
    for(let i=2;i<args.length;i++)if(args[i]==="--break"||args[i]==="-b"){const n=Number(args[++i]);if(Number.isInteger(n)&&n>0)breaks.push(n);}
    try{const source=fs.readFileSync(file,"utf8"),program=parseSource(source),interpreter=new Interpreter(),inspector=new GasInspector(source,breaks);inspector.start(interpreter);interpreter.interpret(program);interpreter.runMain();return 0;}catch(error){console.error(formatError(error));return 1;}
  }
  if (args[0] === "build") {
    let kind = "fat";
    let dir = process.cwd();
    for (const arg of args.slice(1)) {
      if (arg === "--fat") kind = "fat";
      else if (arg === "--fatter") kind = "fatter";
      else dir = arg;
    }
    try {
      const output = buildFat(dir, kind as "fat" | "fatter");
      console.log((kind === "fatter" ? "FATTER FART ready: " : "FAT FART ready: ") + output);
      return 0;
    } catch (error) { console.error(formatError(error)); return 1; }
  }
  if (args[0] === "run") {
    const file = args[1];
    if (!file) { console.error("FART ERROR: run needs a .fat or .fatter file."); return 1; }
    try { await runFat(file); return 0; }
    catch (error) { console.error(formatError(error)); return 1; }
  }
  if (args[0] === "station") {
    const port = Number(args[1] ?? 4873);
    startStation(port);
    console.log("Gas Station is pumping on http://127.0.0.1:" + port);
    return new Promise(() => {});
  }
  if (args[0] === "check") {
    const file = args[1];
    if (!file) { console.error("FART ERROR: check needs a .fart file."); return 1; }
    if (!fs.existsSync(file)) { console.error("FART ERROR: File not found: " + file); return 1; }
    try { check(fs.readFileSync(file, "utf8")); console.log("No stink detected. Syntax is clean."); return 0; }
    catch (error) { console.error(formatError(error)); return 1; }
  }
  if (args[0] === "bag") {
    try { return await bagCommand(args); }
    catch (error) { console.error(formatError(error)); return 1; }
  }
  if (args[0] === "fmt") {
    const write = args[1] === "--write";
    const file = write ? args[2] : args[1];
    if (!file) { console.error("FART ERROR: fmt needs a .fart file."); return 1; }
    try { formatFile(file, write); if (write) console.log("Air freshened: " + file); return 0; }
    catch (error) { console.error(formatError(error)); return 1; }
  }
  const file = args[0];
  if (typeof file !== "string") { console.error("FART ERROR: File not found: "); return 1; }
  if (!fs.existsSync(file)) { console.error("FART ERROR: File not found: " + file); return 1; }
  try { execute(fs.readFileSync(file, "utf8")); return 0; }
  catch (error) { console.error(formatError(error)); return 1; }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = await main();
