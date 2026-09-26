import { RuntimeError } from "./runtime.js";

export function installStdlib(environment, runtime) {
  const number = (name, fn) => environment.define(name, value => {
    if (typeof value !== "number") throw new RuntimeError(name + " needs a number.");
    return fn(value);
  });

  number("abs", Math.abs);
  number("floor", Math.floor);
  number("ceil", Math.ceil);
  number("round", Math.round);
  number("sqrt", value => {
    if (value < 0) throw new RuntimeError("sqrt needs a non-negative number.");
    return Math.sqrt(value);
  });

  environment.define("upper", value => {
    if (typeof value !== "string") throw new RuntimeError("upper needs a string.");
    return value.toUpperCase();
  });

  environment.define("lower", value => {
    if (typeof value !== "string") throw new RuntimeError("lower needs a string.");
    return value.toLowerCase();
  });

  environment.define("trim", value => {
    if (typeof value !== "string") throw new RuntimeError("trim needs a string.");
    return value.trim();
  });

  environment.define("contains", (value, part) => {
    if (typeof value !== "string" || typeof part !== "string") {
      throw new RuntimeError("contains needs two strings.");
    }
    return value.includes(part);
  });

  environment.define("random", () => Math.random());

  environment.define("now", () => Date.now());

  environment.define("type", value => {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (typeof value === "function") return "function";
    return typeof value;
  });

  environment.define("stringify", value => runtime.stringify(value));
}
