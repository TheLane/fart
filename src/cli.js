#!/usr/bin/env node
import fs from "node:fs";
import readline from "node:readline";
import { pathToFileURL } from "node:url";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";
import { formatSource } from "./formatter.js";

export const VERSION = "1.0.0";

export function parseSource(source) {
  const tokens = new Lexer(source).scanTokens();
  return new Parser(tokens).parse();
}

export function execute(source, output = console.log, runMain = true, interpreter = null) {
  const program = parseSource(source);
  const runtime = interpreter ?? new Interpreter(output);
  runtime.interpret(program);
  return runMain ? runtime.runMain() : runtime;
}

export function check(source) {
  parseSource(source);
  return true;
}

function formatError(error) {
  const kind = error.name === "LexerError" ? "FART STINK" : "FART ERROR";
  const position = error.line ? ` at line ${error.line}, column ${error.column}` : "";
  return `${kind}${position}: ${error.message}`;
}

function printHelp() {
  console.log("Fart — a programming language that stinks, but runs.");
  console.log("");
  console.log("Usage:");
  console.log("  fart <file.fart>    Run a Fart program");
  console.log("  fart check <file>   Check syntax without running");
  console.log("  fart fmt <file>     Format a Fart program");
  console.log("  fart fmt --write <file>  Format file in place");
  console.log("  fart repl           Start the Fart REPL");
  console.log("  fart --version      Show version");
  console.log("  fart --help         Show this help");
  console.log("");
  console.log("REPL commands:");
  console.log("  .help               Show help");
  console.log("  .version            Show version");
  console.log("  .exit               Exit the REPL");
}

async function repl() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "fart> " });
  const interpreter = new Interpreter();
  console.log("Fart REPL v" + VERSION);
  console.log("Type .help for commands, .exit to leave.");
  rl.prompt();
  for await (const line of rl) {
    const input = line.trim();
    if (input === ".exit") { rl.close(); break; }
    if (input === ".help") {
      console.log(".help  Show help");
      console.log(".version  Show version");
      console.log(".exit  Exit the REPL");
      rl.prompt();
      continue;
    }
    if (input === ".version") {
      console.log(VERSION);
      rl.prompt();
      continue;
    }
    if (!input) { rl.prompt(); continue; }
    try { execute(input, console.log, false, interpreter); }
    catch (error) { console.error(formatError(error)); }
    rl.prompt();
  }
}

function formatFile(file, write) {
  if (!fs.existsSync(file)) throw new Error("File not found: " + file);
  const source = fs.readFileSync(file, "utf8");
  const formatted = formatSource(source);
  if (write) fs.writeFileSync(file, formatted, "utf8");
  else process.stdout.write(formatted);
}

export async function main(args = process.argv.slice(2)) {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp();
    return 0;
  }
  if (args[0] === "--version" || args[0] === "-v") {
    console.log(VERSION);
    return 0;
  }
  if (args[0] === "repl") {
    await repl();
    return 0;
  }
  if (args[0] === "check") {
    const file = args[1];
    if (!file) { console.error("FART ERROR: check needs a .fart file."); return 1; }
    if (!fs.existsSync(file)) { console.error("FART ERROR: File not found: " + file); return 1; }
    try {
      check(fs.readFileSync(file, "utf8"));
      console.log("No stink detected. Syntax is clean.");
      return 0;
    } catch (error) {
      console.error(formatError(error));
      return 1;
    }
  }
  if (args[0] === "fmt") {
    const write = args[1] === "--write";
    const file = write ? args[2] : args[1];
    if (!file) { console.error("FART ERROR: fmt needs a .fart file."); return 1; }
    try {
      formatFile(file, write);
      if (write) console.log("Air freshened: " + file);
      return 0;
    } catch (error) {
      console.error(formatError(error));
      return 1;
    }
  }

  const file = args[0];
  if (!fs.existsSync(file)) { console.error("FART ERROR: File not found: " + file); return 1; }
  try {
    execute(fs.readFileSync(file, "utf8"));
    return 0;
  } catch (error) {
    console.error(formatError(error));
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main();
}
