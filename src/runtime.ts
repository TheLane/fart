import type { FunctionDeclaration, Statement, AstNode } from "./ast.js";
export type BuiltinFunction = (...args: RuntimeValue[]) => RuntimeValue;
export type RuntimeValue = number | string | boolean | null | RuntimeArray | FartFunction | BuiltinFunction;
export type RuntimeArray = RuntimeValue[];

export class Environment {
  private values = new Map<string, RuntimeValue>();
  constructor(public enclosing: Environment | null = null) {}
  define(name: string, value: RuntimeValue): void { this.values.set(name, value); }
  get(name: string): RuntimeValue {
    if (this.values.has(name)) return this.values.get(name)!;
    if (this.enclosing) return this.enclosing.get(name);
    throw new Error("Undefined variable '" + name + "'.");
  }
  assign(name: string, value: RuntimeValue): void {
    if (this.values.has(name)) { this.values.set(name, value); return; }
    if (this.enclosing) { this.enclosing.assign(name, value); return; }
    throw new Error("Undefined variable '" + name + "'.");
  }
  entries(): Array<[string, RuntimeValue]> { return [...this.values.entries()]; }
}
export class RuntimeError extends Error {
  constructor(message: string, public node: AstNode | null = null) { super(message); this.name = "RuntimeError"; }
}
export class ReturnSignal {
  constructor(public value: RuntimeValue) {}
}
export interface CallableInterpreter {
  executeBlock(statements: Statement[], environment: Environment): void;
}
export class FartFunction {
  constructor(public declaration: FunctionDeclaration, public closure: Environment, public interpreter: CallableInterpreter) {}
  call(args: RuntimeValue[]): RuntimeValue {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) environment.define(this.declaration.params[i], args[i] ?? null);
    try { this.interpreter.executeBlock(this.declaration.body.statements, environment); }
    catch (error) { if (error instanceof ReturnSignal) return error.value; throw error; }
    return null;
  }
  arity(): number { return this.declaration.params.length; }
  toString(): string { return "<fart " + this.declaration.name + ">"; }
}