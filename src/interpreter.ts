import { Token, TokenType } from "./token"
import type { ExprVisitor, Expr } from "./expr";
import { LiteralExpr, GroupingExpr, BinaryExpr, UnaryExpr } from "./expr";
import { RuntimeError } from "./runtimeError";
import { Reda } from "./reda";

export class Interpreter implements ExprVisitor<any> {

  interpret(expression: Expr) {
    try {
      const value: any = this.evaluate(expression);
      console.log(this.stringify(value));
    } catch (error: any) {
      Reda.runtimeError(error);
    }
  }

  visitLiteralExpr(expr: LiteralExpr) {
    return expr.value;
  }

  visitGroupingExpr(expr: GroupingExpr) {
    return this.evaluate(expr.expression);
  }

  visitUnaryExpr(expr: UnaryExpr) {
    const right: any = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expr.operator, right);
        return -(right as number)
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  }

  private checkNumberOperand(operator: Token, operand: any) {
    if (typeof operand === 'number') return;
    throw new RuntimeError(operator, "Operand must be number.");
  }

  private checkNumberOperands(operator: Token, left: any, right: any) {
    if (typeof left === 'number' && typeof right === 'number') return;

    throw new RuntimeError(operator, "Operand must be number.");
  }

  private isTruthy(object: any): boolean {
    if (object === null) return false;
    if (typeof object === 'boolean') return object as boolean;
    return true;
  }

  private isEqual(a: any, b: any) {
    if (a === null && b === null) return true;
    if (a === null) return false;

    if (typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean') {
      return a === b;
    }

    return Object.is(a, b); 
  }

  private stringify(object: any): string {
    if (object === null) return 'nil';
    return object.toString();
  }

  visitBinaryExpr(expr: BinaryExpr) {
    const left: any = this.evaluate(expr.left);
    const right: any = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) > (right as number)
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) >= (right as number)
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) < (right as number)
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) <= (right as number)
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) - (right as number)
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return (left as number) + (right as number);
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return (left as string) + (right as string);
        }

        throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.")
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) / (right as number)
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return (left as number) * (right as number)
      case TokenType.BANG_EQUAL: return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL: return this.isEqual(left, right);
    }

    return null;
  }

  private evaluate(expr: Expr): any {
    return expr.accept(this);
  }

}
