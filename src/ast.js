import { TokenType } from "./token.js";

export class Program {
  constructor(statements) { this.statements = statements; }
}

export class FunctionDeclaration {
  constructor(name, params, body) {
    this.name = name;
    this.params = params;
    this.body = body;
  }
}

export class VariableDeclaration {
  constructor(name, initializer) {
    this.name = name;
    this.initializer = initializer;
  }
}

export class Block {
  constructor(statements) { this.statements = statements; }
}

export class IfStatement {
  constructor(condition, thenBranch, elseBranch) {
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
}

export class WhileStatement {
  constructor(condition, body) {
    this.condition = condition;
    this.body = body;
  }
}

export class ReleaseStatement {
  constructor(value) { this.value = value; }
}

export class ExpressionStatement {
  constructor(expression) { this.expression = expression; }
}

export class Assignment {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

export class Binary {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class Unary {
  constructor(operator, right) {
    this.operator = operator;
    this.right = right;
  }
}

export class Literal {
  constructor(value) { this.value = value; }
}

export class Variable {
  constructor(name) { this.name = name; }
}

export class Call {
  constructor(callee, args) {
    this.callee = callee;
    this.args = args;
  }
}

export class Environment {
  constructor(enclosing = null) {
    this.values = new Map();
    this.enclosing = enclosing;
  }
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
  constructor(message, node = null) {
    super(message);
    this.name = "RuntimeError";
    this.node = node;
  }
}

export class ReturnSignal {
  constructor(value) { this.value = value; }
}

export class FartFunction {
  constructor(declaration, closure, interpreter) {
    this.declaration = declaration;
    this.closure = closure;
    this.interpreter = interpreter;
  }
  call(args) {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i], args[i]);
    }
    try {
      this.interpreter.executeBlock(this.declaration.body.statements, environment);
    } catch (error) {
      if (error instanceof ReturnSignal) return error.value;
      throw error;
    }
    return null;
  }
  arity() { return this.declaration.params.length; }
  toString() { return "<fart " + this.declaration.name + ">"; }
}

export class Interpreter {
  constructor(output = console.log) {
    this.output = output;
    this.globals = new Environment();
    this.environment = this.globals;
    this.globals.define("smell", (...values) => {
      this.output(values.map(value => this.stringify(value)).join(" "));
      return null;
    });
  }

  interpret(program) {
    try {
      for (const statement of program.statements) this.execute(statement);
    } catch (error) {
      if (error instanceof ReturnSignal) throw new RuntimeError("release used outside a fart.");
      if (error instanceof RuntimeError) throw error;
      throw new RuntimeError(error.message);
    }
  }

  runMain() {
    let main;
    try { main = this.globals.get("main"); }
    catch { throw new RuntimeError("No main fart found."); }
    return this.callValue(main, [], null);
  }

  execute(node) {
    if (node instanceof FunctionDeclaration) {
      this.environment.define(node.name, new FartFunction(node, this.environment, this));
      return null;
    }
    if (node instanceof VariableDeclaration) {
      const value = node.initializer ? this.evaluate(node.initializer) : null;
      this.environment.define(node.name, value);
      return null;
    }
    if (node instanceof Block) return this.executeBlock(node.statements, new Environment(this.environment));
    if (node instanceof IfStatement) {
      if (this.isTruthy(this.evaluate(node.condition))) return this.execute(node.thenBranch);
      if (node.elseBranch) return this.execute(node.elseBranch);
      return null;
    }
    if (node instanceof WhileStatement) {
      while (this.isTruthy(this.evaluate(node.condition))) this.execute(node.body);
      return null;
    }
    if (node instanceof ReleaseStatement) throw new ReturnSignal(node.value ? this.evaluate(node.value) : null);
    if (node instanceof ExpressionStatement) return this.evaluate(node.expression);
    throw new RuntimeError("Unknown statement.", node);
  }

  executeBlock(statements, environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) this.execute(statement);
    } finally {
      this.environment = previous;
    }
  }

  evaluate(node) {
    if (node instanceof Literal) return node.value;
    if (node instanceof Variable) {
      try { return this.environment.get(node.name); }
      catch { throw new RuntimeError("Undefined variable '" + node.name + "'.", node); }
    }
    if (node instanceof Assignment) {
      const value = this.evaluate(node.value);
      try { this.environment.assign(node.name, value); }
      catch { throw new RuntimeError("Undefined variable '" + node.name + "'.", node); }
      return value;
    }
    if (node instanceof Unary) {
      const right = this.evaluate(node.right);
      if (node.operator === TokenType.MINUS) {
        this.requireNumber(right, node);
        return -right;
      }
      if (node.operator === TokenType.BANG) return !this.isTruthy(right);
    }
    if (node instanceof Binary) return this.evaluateBinary(node);
    if (node instanceof Call) {
      const callee = this.evaluate(node.callee);
      const args = node.args.map(argument => this.evaluate(argument));
      return this.callValue(callee, args, node);
    }
    throw new RuntimeError("Unknown expression.", node);
  }

  evaluateBinary(node) {
    if (node.operator === TokenType.OR_OR) {
      const left = this.evaluate(node.left);
      return this.isTruthy(left) ? left : this.evaluate(node.right);
    }
    if (node.operator === TokenType.AND_AND) {
      const left = this.evaluate(node.left);
      return this.isTruthy(left) ? this.evaluate(node.right) : left;
    }
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);
    switch (node.operator) {
      case TokenType.PLUS:
        if (typeof left === "number" && typeof right === "number") return left + right;
        if (typeof left === "string" && typeof right === "string") return left + right;
        throw new RuntimeError("Can only add two numbers or two strings.", node);
      case TokenType.MINUS: return this.numeric(left, right, node, (a, b) => a - b);
      case TokenType.STAR: return this.numeric(left, right, node, (a, b) => a * b);
      case TokenType.SLASH:
        if (typeof left !== "number" || typeof right !== "number") throw new RuntimeError("Operands must be numbers.", node);
        if (right === 0) throw new RuntimeError("Division by zero.", node);
        return left / right;
      case TokenType.GREATER: return this.compare(left, right, node, (a, b) => a > b);
      case TokenType.GREATER_EQUAL: return this.compare(left, right, node, (a, b) => a >= b);
      case TokenType.LESS: return this.compare(left, right, node, (a, b) => a < b);
      case TokenType.LESS_EQUAL: return this.compare(left, right, node, (a, b) => a <= b);
      case TokenType.EQUAL_EQUAL: return this.isEqual(left, right);
      case TokenType.BANG_EQUAL: return !this.isEqual(left, right);
      default: throw new RuntimeError("Unknown binary operator.", node);
    }
  }

  numeric(left, right, node, operation) {
    if (typeof left !== "number" || typeof right !== "number") throw new RuntimeError("Operands must be numbers.", node);
    return operation(left, right);
  }

  compare(left, right, node, operation) {
    if (typeof left !== "number" || typeof right !== "number") throw new RuntimeError("Operands must be numbers.", node);
    return operation(left, right);
  }

  requireNumber(value, node) {
    if (typeof value !== "number") throw new RuntimeError("Operand must be a number.", node);
  }

  callValue(callee, args, node) {
    if (callee instanceof FartFunction) {
      if (args.length !== callee.arity()) {
        throw new RuntimeError("Expected " + callee.arity() + " arguments but got " + args.length + ".", node);
      }
      return callee.call(args);
    }
    if (typeof callee === "function") return Reflect.apply(callee, null, args);
    throw new RuntimeError("Can only call a fart or a built-in function.", node);
  }

  isTruthy(value) { return value !== null && value !== false; }
  isEqual(left, right) { return left === right; }

  stringify(value) {
    if (value === null) return "null";
    if (value === true) return "true";
    if (value === false) return "false";
    return String(value);
  }
}
