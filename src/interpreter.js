import { TokenType } from "./token.js";
import { FunctionDeclaration, VariableDeclaration, Block, IfStatement, WhileStatement, ReleaseStatement, ExpressionStatement, Assignment, Binary, Unary, Literal, Variable, Call, ArrayLiteral, Index, IndexAssignment } from "./ast.js";
import { Environment, RuntimeError, ReturnSignal, FartFunction } from "./runtime.js";
import { installStdlib } from "./stdlib.js";

export class Interpreter {
  constructor(output = console.log) {
    this.output = output;
    this.globals = new Environment();
    this.environment = this.globals;
    this.globals.define("smell", (...values) => {
      this.output(values.map(v => this.stringify(v)).join(" "));
      return null;
    });
    this.globals.define("length", value => {
      if (!Array.isArray(value) && typeof value !== "string") throw new RuntimeError("length needs an array or string.");
      return value.length;
    });
    installStdlib(this.globals, this);
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
    try { main = this.globals.get("main"); } catch { throw new RuntimeError("No main fart found."); }
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
    if (node instanceof ArrayLiteral) return node.elements.map(element => this.evaluate(element));
    if (node instanceof Index) {
      const object = this.evaluate(node.object);
      const index = this.evaluate(node.index);
      return this.readIndex(object, index, node);
    }
    if (node instanceof IndexAssignment) {
      const object = this.evaluate(node.object);
      const index = this.evaluate(node.index);
      const value = this.evaluate(node.value);
      this.writeIndex(object, index, value, node);
      return value;
    }
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
      const args = node.args.map(a => this.evaluate(a));
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

  numeric(a, b, node, op) {
    if (typeof a !== "number" || typeof b !== "number") throw new RuntimeError("Operands must be numbers.", node);
    return op(a, b);
  }

  compare(a, b, node, op) {
    if (typeof a !== "number" || typeof b !== "number") throw new RuntimeError("Operands must be numbers.", node);
    return op(a, b);
  }

  requireNumber(value, node) {
    if (typeof value !== "number") throw new RuntimeError("Operand must be a number.", node);
  }

  callValue(callee, args, node) {
    if (callee instanceof FartFunction) {
      if (args.length !== callee.arity()) throw new RuntimeError("Expected " + callee.arity() + " arguments but got " + args.length + ".", node);
      return callee.call(args);
    }
    if (typeof callee === "function") return Reflect.apply(callee, null, args);
    throw new RuntimeError("Can only call a fart or a built-in function.", node);
  }

  isTruthy(value) { return value !== null && value !== false; }
  isEqual(a, b) { return a === b; }

  readIndex(object, index, node) {
    if (!Array.isArray(object) && typeof object !== "string") throw new RuntimeError("Can only index an array or string.", node);
    if (!Number.isInteger(index)) throw new RuntimeError("Array index must be an integer.", node);
    if (index < 0 || index >= object.length) throw new RuntimeError("Array index out of bounds.", node);
    return object[index];
  }

  writeIndex(object, index, value, node) {
    if (!Array.isArray(object)) throw new RuntimeError("Can only assign an array element.", node);
    if (!Number.isInteger(index)) throw new RuntimeError("Array index must be an integer.", node);
    if (index < 0 || index >= object.length) throw new RuntimeError("Array index out of bounds.", node);
    object[index] = value;
  }

  stringify(value) {
    if (value === null) return "null";
    if (value === true) return "true";
    if (value === false) return "false";
    if (Array.isArray(value)) return "[" + value.map(v => this.stringify(v)).join(", ") + "]";
    return String(value);
  }
}
