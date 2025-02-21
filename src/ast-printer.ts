import { Token, TokenType  } from './token';
import { BinaryExpr, GroupingExpr, LiteralExpr, UnaryExpr } from './expr';
import type { Expr, ExprVisitor } from './expr';

export class AstPrinter implements ExprVisitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  visitBinaryExpr(expr: BinaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: GroupingExpr): string {
    return this.parenthesize("group", expr.expression);
  }

  visitLiteralExpr(expr: LiteralExpr): string {
    if (expr.value === null) return "nil";
    return expr.value.toString();
  }

  visitUnaryExpr(expr: UnaryExpr): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    let result = `(${name}`;
    for (const expr of exprs) {
      result += " " + expr.accept(this);
    }
    result += ")";
    return result;
  }
}

const expression: Expr = new BinaryExpr(
  new UnaryExpr(
    { type: TokenType.MINUS, lexeme: "-", literal: null, line: 1 },
    new LiteralExpr(123)
  ),
  { type: TokenType.STAR, lexeme: "*", literal: null, line: 1 },
  new GroupingExpr(
    new LiteralExpr(45.67)
  )
);

const printer = new AstPrinter();
const result = printer.print(expression);

console.log(result);

