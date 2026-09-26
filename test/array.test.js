import test from "node:test";
import assert from "node:assert/strict";
import { Lexer } from "../src/lexer.js";
import { Parser } from "../src/parser.js";
import { Interpreter } from "../src/interpreter.js";
function run(source){const output=[];const program=new Parser(new Lexer(source).scanTokens()).parse();const interpreter=new Interpreter(v=>output.push(v));interpreter.interpret(program);return {output,result:interpreter.runMain()};}
test("creates and indexes arrays",()=>{const {output}=run(`fart main(){let gas=[10,20,30];smell(gas[1]);release gas[2];}`);assert.deepEqual(output,["20"]);});
test("assigns array elements",()=>{const {result}=run(`fart main(){let gas=[1,2,3];gas[1]=42;release gas[1];}`);assert.equal(result,42);});
test("supports array length",()=>{const {result}=run(`fart main(){let gas=[1,2,3,4];release length(gas);}`);assert.equal(result,4);});
test("supports nested arrays",()=>{const {result}=run(`fart main(){let gas=[[1,2],[3,4]];release gas[1][0];}`);assert.equal(result,3);});
test("reports invalid array index",()=>{assert.throws(()=>run(`fart main(){let gas=[1];release gas[2];}`),/Array index out of bounds/);});
