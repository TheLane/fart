import fs from "node:fs";
import { FunctionDeclaration, Block } from "./ast.js";
import type { Interpreter } from "./interpreter.js";

export class GasInspector {
  private breakpoints = new Set<number>();
  private stepping = true;
  private running = true;
  private sourceLines: string[];
  private callStack: string[] = ["<top-level>"];

  constructor(private source: string, initialBreakpoints: number[] = []) {
    this.sourceLines = source.split(/\r?\n/);
    for (const line of initialBreakpoints) if (line > 0) this.breakpoints.add(line);
  }
  start(interpreter: Interpreter): void {
    interpreter.debugHook = event => {
      if (event.statement instanceof FunctionDeclaration || event.statement instanceof Block) return;
      const line = event.statement.line;
      if (this.running && (this.stepping || this.breakpoints.has(line))) this.prompt(line, interpreter);
    };
    interpreter.debugCall = (name, entering) => { if (entering) this.callStack.push(name); else if (this.callStack.length > 1) this.callStack.pop(); };
  }
  private prompt(line: number, interpreter: Interpreter): void {
    this.stepping = false;
    console.log("\n🔥 GAS INSPECTOR — stopped at line " + line);
    this.printSource(line);
    console.log("continue | next | break <line> | clear <line> | print <gas> | locals | stack | list | quit");
    while (true) {
      const input = this.readLine("inspect> ").trim(), [command, ...args] = input.split(/\s+/);
      if (command === "continue" || command === "c") { this.stepping = false; return; }
      if (command === "next" || command === "n") { this.stepping = true; return; }
      if (command === "break" || command === "b") { const n=Number(args[0]); if(Number.isInteger(n)&&n>0){this.breakpoints.add(n);console.log("Breakpoint set at line "+n+".");} continue; }
      if (command === "clear") { const n=Number(args[0]); this.breakpoints.delete(n); console.log("Breakpoint cleared at line "+n+"."); continue; }
      if (command === "print" || command === "p") { this.printValue(args[0],interpreter); continue; }
      if (command === "locals" || command === "l") { for(const [n,v] of interpreter.environment.entries()) console.log(n+" = "+interpreter.stringify(v)); continue; }
      if (command === "stack" || command === "s") { this.callStack.forEach((n,i)=>console.log("#"+i+" "+n)); continue; }
      if (command === "list") { this.printSource(line,2); continue; }
      if (command === "quit" || command === "q" || command === "exit") throw new Error("Inspector aborted.");
      if (command) console.log("Unknown inspector command.");
    }
  }
  private printValue(name: string|undefined, interpreter: Interpreter): void {
    if(!name){console.log("print needs a gas name.");return;}
    try{console.log(name+" = "+interpreter.stringify(interpreter.environment.get(name)));}catch{console.log("Gas not found: "+name);}
  }
  private printSource(line:number,radius=1):void{for(let i=Math.max(1,line-radius);i<=Math.min(this.sourceLines.length,line+radius);i++)console.log((i===line?">":" ")+" "+String(i).padStart(4," ")+" | "+this.sourceLines[i-1]);}
  private readLine(prompt:string):string{fs.writeSync(1,prompt);const b=Buffer.alloc(4096);let t="";while(true){const n=fs.readSync(0,b,0,b.length,null);if(n<=0)break;t+=b.subarray(0,n).toString("utf8");const i=t.indexOf("\n");if(i>=0)return t.slice(0,i).replace(/\r$/,"");}return t;}
}