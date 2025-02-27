import { Token, TokenType } from './token';
import { Scanner } from './scanner';
import { Parser } from './parser';
import { AstPrinter } from './ast-printer';

function parse(source: string): void {
  console.log("Source:", source);
  
  // Scan tokens
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  
  console.log("Tokens:", tokens);
  
  // Parse tokens
  const parser = new Parser(tokens);
  const expression = parser.parse(); // You'll need to add this method
  
  if (expression) {
    // Print the AST
    const printer = new AstPrinter();
    console.log("AST:", printer.print(expression));
  } else {
    console.log("Error: Failed to parse expression");
  }
  
  console.log("----------------------------");
}

// Test with various expressions
parse("1 + 2");
parse("1 + 2 * 3");
parse("-123 * (45.67)");
parse("!true == false");
parse("1 > 2 == 3 < 4");
