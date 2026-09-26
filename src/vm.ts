import { Op, type Chunk, type FartFunction } from "./compiler.js";

type Frame = { chunk: Chunk; ip: number; base: number; name: string };
export type VmOutput = (text: string) => void;

export class VirtualMachine {
  private stack: unknown[] = [];
  private globals: unknown[] = [];
  private frames: Frame[] = [];

  constructor(private output: VmOutput = console.log) {}

  run(chunk: Chunk): void {
    this.frames = [{ chunk, ip: 0, base: 0, name: chunk.name }];
    while (this.frames.length) this.step();
  }

  private step(): void {
    const frame = this.frames[this.frames.length - 1]!;
    const instruction = frame.chunk.code[frame.ip++];
    if (!instruction) { this.frames.pop(); return; }
    const arg = instruction.operand;
    switch (instruction.op) {
      case Op.CONSTANT: this.push(frame.chunk.constants[arg!]); break;
      case Op.NULL: this.push(null); break;
      case Op.TRUE: this.push(true); break;
      case Op.FALSE: this.push(false); break;
      case Op.POP: this.pop(); break;
      case Op.GET_GLOBAL: this.push(this.globals[arg!] ?? null); break;
      case Op.SET_GLOBAL: this.globals[arg!] = this.peek(); break;
      case Op.GET_LOCAL: this.push(this.stack[frame.base + arg!] ?? null); break;
      case Op.SET_LOCAL: this.stack[frame.base + arg!] = this.peek(); break;
      case Op.ADD: this.binary((a,b) => typeof a === "string" || typeof b === "string" ? this.stringify(a) + this.stringify(b) : (a as number) + (b as number)); break;
      case Op.SUBTRACT: this.binary((a,b) => (a as number) - (b as number)); break;
      case Op.MULTIPLY: this.binary((a,b) => (a as number) * (b as number)); break;
      case Op.DIVIDE: {
        const b = this.pop() as number, a = this.pop() as number;
        if (b === 0) throw Error("FART VM ERROR: division by zero");
        this.push(a / b); break;
      }
      case Op.NEGATE: this.push(-(this.pop() as number)); break;
      case Op.NOT: this.push(!this.truthy(this.pop())); break;
      case Op.EQUAL: this.binary((a,b) => a === b); break;
      case Op.NOT_EQUAL: this.binary((a,b) => a !== b); break;
      case Op.GREATER: this.binary((a,b) => (a as number) > (b as number)); break;
      case Op.GREATER_EQUAL: this.binary((a,b) => (a as number) >= (b as number)); break;
      case Op.LESS: this.binary((a,b) => (a as number) < (b as number)); break;
      case Op.LESS_EQUAL: this.binary((a,b) => (a as number) <= (b as number)); break;
      case Op.JUMP: frame.ip = arg!; break;
      case Op.JUMP_IF_FALSE: if (!this.truthy(this.pop())) frame.ip = arg!; break;
      case Op.LOOP: frame.ip = arg!; break;
      case Op.ARRAY: {
        const n = arg!;
        this.push(this.stack.splice(this.stack.length - n, n));
        break;
      }
      case Op.INDEX: {
        const index = this.pop() as number, object = this.pop() as unknown[];
        this.push(object[index] ?? null); break;
      }
      case Op.SET_INDEX: {
        const value = this.pop(), index = this.pop() as number, object = this.pop() as unknown[];
        object[index] = value; this.push(value); break;
      }
      case Op.SMELL: {
        const values = this.stack.splice(this.stack.length - arg!, arg!);
        this.output(values.map(value => this.stringify(value)).join(" "));
        this.push(null); break;
      }
      case Op.BUILTIN: this.builtin(arg!); break;
      case Op.CALL: this.call(arg!); break;
      case Op.RETURN: {
        const value = this.pop(), finished = this.frames.pop()!;
        this.stack.length = finished.base;
        if (this.frames.length) this.push(value);
        break;
      }
      default: throw Error("FART VM ERROR: unknown opcode");
    }
  }

  private builtin(code: number): void {
    const id = Math.floor(code / 100);
    const count = code % 100;
    const args = this.stack.splice(this.stack.length - count, count);
    const x = args[0], y = args[1];
    let value: unknown;

    switch (id) {
      case 0: value = this.number("abs", x, Math.abs); break;
      case 1: value = this.number("floor", x, Math.floor); break;
      case 2: value = this.number("ceil", x, Math.ceil); break;
      case 3: value = this.number("round", x, Math.round); break;
      case 4:
        if (typeof x !== "number") throw Error("sqrt needs a number.");
        if (x < 0) throw Error("sqrt needs a non-negative number.");
        value = Math.sqrt(x); break;
      case 5:
        if (typeof x !== "string") throw Error("upper needs a string.");
        value = x.toUpperCase(); break;
      case 6:
        if (typeof x !== "string") throw Error("lower needs a string.");
        value = x.toLowerCase(); break;
      case 7:
        if (typeof x !== "string") throw Error("trim needs a string.");
        value = x.trim(); break;
      case 8:
        if (typeof x !== "string" || typeof y !== "string") throw Error("contains needs two strings.");
        value = x.includes(y); break;
      case 9: value = Math.random(); break;
      case 10: value = Date.now(); break;
      case 11: value = x === null ? "null" : Array.isArray(x) ? "array" : typeof x; break;
      case 12: value = this.stringify(x); break;
      case 13:
        if (typeof x !== "string" && !Array.isArray(x)) throw Error("length needs a string or array.");
        value = x.length; break;
      default: throw Error("FART VM ERROR: unknown builtin");
    }
    this.push(value);
  }

  private number(name: string, value: unknown, fn: (n: number) => number): number {
    if (typeof value !== "number") throw Error(name + " needs a number.");
    return fn(value);
  }

  private call(arity: number): void {
    const calleeIndex = this.stack.length - arity - 1;
    const fn = this.stack[calleeIndex] as FartFunction;
    if (!fn?.chunk) throw Error("FART VM ERROR: value is not callable");
    if (fn.arity !== arity) throw Error(`FART VM ERROR: expected ${fn.arity} arguments but got ${arity}`);
    this.stack.splice(calleeIndex, 1);
    this.frames.push({ chunk: fn.chunk, ip: 0, base: calleeIndex, name: fn.name });
  }

  private binary(fn: (a: unknown, b: unknown) => unknown): void {
    const b = this.pop(), a = this.pop();
    this.push(fn(a, b));
  }
  private push(value: unknown): void { this.stack.push(value); }
  private pop(): unknown {
    if (!this.stack.length) throw Error("FART VM ERROR: stack underflow");
    return this.stack.pop();
  }
  private peek(): unknown { return this.stack[this.stack.length - 1]; }
  private truthy(value: unknown): boolean { return value !== false && value !== null; }
  private stringify(value: unknown): string {
    if (value === null) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (Array.isArray(value)) return "[" + value.map(item => this.stringify(item)).join(", ") + "]";
    return String(value);
  }
}
