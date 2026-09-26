export class Environment {
  constructor(enclosing = null) { this.values = new Map(); this.enclosing = enclosing; }
  define(name, value) { this.values.set(name, value); }
  get(name) {
    if (this.values.has(name)) return this.values.get(name);
    if (this.enclosing) return this.enclosing.get(name);
    throw new Error("Undefined variable '" + name + "'.");
  }
  assign(name, value) {
    if (this.values.has(name)) { this.values.set(name, value); return; }
    if (this.enclosing) { this.enclosing.assign(name, value); return; }
    throw new Error("Undefined variable '" + name + "'.");
  }
}
export class RuntimeError extends Error {
  constructor(message, node = null) { super(message); this.name = "RuntimeError"; this.node = node; }
}
export class ReturnSignal { constructor(value) { this.value = value; } }
export class FartFunction {
  constructor(declaration, closure, interpreter) { this.declaration = declaration; this.closure = closure; this.interpreter = interpreter; }
  call(args) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) environment.define(this.declaration.params[i], args[i]);
    try { this.interpreter.executeBlock(this.declaration.body.statements, environment); }
    catch (error) { if (error instanceof ReturnSignal) return error.value; throw error; }
    return null;
  }
  arity() { return this.declaration.params.length; }
  toString() { return "<fart " + this.declaration.name + ">"; }
}
