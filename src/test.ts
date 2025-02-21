import type { Expr } from "./expr";
import { AstPrinter } from "./ast-printer";
import { Token, TokenType } from "./token";

const expression: Expr = {
  type: "Binary",
  left: {
    type: "Unary",
    operator: { lexeme: "-", type: TokenType.MINUS, literal: null, line: 1 } as Token,
    right: { type: "Literal", value: 123 },
  },
  operator: { lexeme: "*", type: TokenType.STAR, literal: null, line: 1 } as Token,
  right: {
    type: "Grouping",
    expression: { type: "Literal", value: 45.67 },
  },
};

const printer = new AstPrinter();
console.log(printer.print(expression));
