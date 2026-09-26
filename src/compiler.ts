import {FunctionDeclaration,VariableDeclaration,Block,IfStatement,WhileStatement,ReleaseStatement,ExpressionStatement,Assignment,Binary,Unary,Literal,Variable,Call,ArrayLiteral,Index,IndexAssignment} from "./ast.js";
import {TokenType} from "./token.js";
export enum Op{CONSTANT,NULL,TRUE,FALSE,POP,GET_GLOBAL,SET_GLOBAL,GET_LOCAL,SET_LOCAL,ADD,SUBTRACT,MULTIPLY,DIVIDE,NEGATE,NOT,EQUAL,NOT_EQUAL,GREATER,GREATER_EQUAL,LESS,LESS_EQUAL,JUMP,JUMP_IF_FALSE,LOOP,CALL,RETURN,ARRAY,INDEX,SET_INDEX,SMELL,BUILTIN}
export type Instruction={op:Op;operand?:number};export type Chunk={code:Instruction[];constants:unknown[];name:string};export type FartFunction={chunk:Chunk;arity:number;name:string};
export class Compiler{
 private chunk:Chunk={code:[],constants:[],name:"<main>"};private globals=new Map<string,number>();private locals=new Map<string,number>();private localCount=0;
 compile(program:{statements:unknown[]}):Chunk{for(const s of program.statements)this.statement(s);if(this.globals.has("main")){this.emit(Op.GET_GLOBAL,this.gi("main"));this.emit(Op.CALL,0);this.emit(Op.POP);}this.emit(Op.NULL);this.emit(Op.RETURN);return this.chunk;}
 private statement(n:unknown):void{
  if(n instanceof FunctionDeclaration){const s=this.enter(n.name);for(const p of n.params)this.locals.set(p,this.localCount++);for(const x of n.body.statements)this.statement(x);this.emit(Op.NULL);this.emit(Op.RETURN);const fn:FartFunction={chunk:this.chunk,arity:n.params.length,name:n.name};this.leave(s);this.emit(Op.CONSTANT,this.add(fn));this.emit(Op.SET_GLOBAL,this.gi(n.name));return;}
  if(n instanceof VariableDeclaration){if(n.initializer)this.expr(n.initializer);else this.emit(Op.NULL);this.emit(Op.SET_GLOBAL,this.gi(n.name));return;}
  if(n instanceof Block){for(const x of n.statements)this.statement(x);return;}
  if(n instanceof IfStatement){this.expr(n.condition);const a=this.emit(Op.JUMP_IF_FALSE,0);this.statement(n.thenBranch);const b=this.emit(Op.JUMP,0);this.patch(a,this.chunk.code.length);if(n.elseBranch)this.statement(n.elseBranch);this.patch(b,this.chunk.code.length);return;}
  if(n instanceof WhileStatement){const a=this.chunk.code.length;this.expr(n.condition);const b=this.emit(Op.JUMP_IF_FALSE,0);this.statement(n.body);this.emit(Op.LOOP,a);this.patch(b,this.chunk.code.length);return;}
  if(n instanceof ReleaseStatement){if(n.value)this.expr(n.value);else this.emit(Op.NULL);this.emit(Op.RETURN);return;}
  if(n instanceof ExpressionStatement){this.expr(n.expression);this.emit(Op.POP);}
 }
 private expr(n:unknown):void{
  if(n instanceof Literal){if(n.value===null)this.emit(Op.NULL);else if(n.value===true)this.emit(Op.TRUE);else if(n.value===false)this.emit(Op.FALSE);else this.emit(Op.CONSTANT,this.add(n.value));return;}
  if(n instanceof Variable){const l=this.locals.get(n.name);this.emit(l===undefined?Op.GET_GLOBAL:Op.GET_LOCAL,l===undefined?this.gi(n.name):l);return;}
  if(n instanceof Assignment){this.expr(n.value);const l=this.locals.get(n.name);this.emit(l===undefined?Op.SET_GLOBAL:Op.SET_LOCAL,l===undefined?this.gi(n.name):l);return;}
  if(n instanceof Binary){if(n.operator===TokenType.AND_AND){this.expr(n.left);const jf=this.emit(Op.JUMP_IF_FALSE,0);this.expr(n.right);const end=this.emit(Op.JUMP,0);this.patch(jf,this.chunk.code.length);this.emit(Op.FALSE);this.patch(end,this.chunk.code.length);return;}if(n.operator===TokenType.OR_OR){this.expr(n.left);const jf=this.emit(Op.JUMP_IF_FALSE,0);this.emit(Op.TRUE);const end=this.emit(Op.JUMP,0);this.patch(jf,this.chunk.code.length);this.expr(n.right);this.patch(end,this.chunk.code.length);return;}this.expr(n.left);this.expr(n.right);const m=new Map<string,Op>([[TokenType.PLUS,Op.ADD],[TokenType.MINUS,Op.SUBTRACT],[TokenType.STAR,Op.MULTIPLY],[TokenType.SLASH,Op.DIVIDE],[TokenType.EQUAL_EQUAL,Op.EQUAL],[TokenType.BANG_EQUAL,Op.NOT_EQUAL],[TokenType.GREATER,Op.GREATER],[TokenType.GREATER_EQUAL,Op.GREATER_EQUAL],[TokenType.LESS,Op.LESS],[TokenType.LESS_EQUAL,Op.LESS_EQUAL]]);const o=m.get(n.operator);if(o===undefined)throw Error("Unsupported VM binary operator");this.emit(o);return;}
  if(n instanceof Unary){this.expr(n.right);this.emit(n.operator===TokenType.MINUS?Op.NEGATE:Op.NOT);return;}
  if(n instanceof Call){if(n.callee instanceof Variable&&n.callee.name==="smell"){for(const a of n.args)this.expr(a);this.emit(Op.SMELL,n.args.length);return;}if(n.callee instanceof Variable&&["abs","floor","ceil","round","sqrt","upper","lower","trim","contains","random","now","type","stringify","length"].includes(n.callee.name)){for(const a of n.args)this.expr(a);this.emit(Op.BUILTIN,["abs","floor","ceil","round","sqrt","upper","lower","trim","contains","random","now","type","stringify","length"].indexOf(n.callee.name)*100+n.args.length);return;}this.expr(n.callee);for(const a of n.args)this.expr(a);this.emit(Op.CALL,n.args.length);return;}
  if(n instanceof ArrayLiteral){for(const e of n.elements)this.expr(e);this.emit(Op.ARRAY,n.elements.length);return;}
  if(n instanceof Index){this.expr(n.object);this.expr(n.index);this.emit(Op.INDEX);return;}
  if(n instanceof IndexAssignment){this.expr(n.object);this.expr(n.index);this.expr(n.value);this.emit(Op.SET_INDEX);return;}
  throw Error("Unsupported AST node in VM compiler");
 }
 private emit(op:Op,operand?:number){this.chunk.code.push(operand===undefined?{op}:{op,operand});return this.chunk.code.length-1;}
 private patch(i:number,t:number){this.chunk.code[i]={...this.chunk.code[i]!,operand:t};}private add(v:unknown){this.chunk.constants.push(v);return this.chunk.constants.length-1;}
 private gi(n:string){const e=this.globals.get(n);if(e!==undefined)return e;const i=this.globals.size;this.globals.set(n,i);return i;}
 private enter(name:string){const s={chunk:this.chunk,locals:this.locals,localCount:this.localCount};this.chunk={code:[],constants:[],name};this.locals=new Map();this.localCount=0;return s;}
 private leave(s:{chunk:Chunk;locals:Map<string,number>;localCount:number}){this.chunk=s.chunk;this.locals=s.locals;this.localCount=s.localCount;}
}