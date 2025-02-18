import * as fs from 'fs';
import * as readline from "readline";
import { Token, TokenType } from "./token";
import { Scanner } from "./scanner"



export class Reda {
  private static hadError: boolean = false;

  main(args: string[]) {
    if (args.length > 1) {
      console.log("Usage: jlox [script]");
      process.exit(64);
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  private runFile(path: string) {
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      console.log(data);
      this.run(data.toString());
    });

    if (Reda.hadError) process.exit(65);
  }

  private async runPrompt() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
      const line = await new Promise<string>(resolve => {
        rl.question('> ', resolve);
      });
      
      if (line === null) break;
      this.run(line);
      Reda.hadError = false;
    }

    rl.close();
  }

  private run(source: string) {
    const scanner = new Scanner(source);
    const tokens: Token[] = scanner.scanTokens();

    tokens.forEach(function (token) {
      console.log(token);
    });
  }

  static error(line: number, message: string): void {
    this.report(line, "", message);
  }

  private static report(line: number, where: string, message: string): void {
    console.log("[line " + line + "] Error" + where + ": " + message);
    this.hadError = true;
  }
}

if (require.main === module) {
  const reda = new Reda();
  reda.main(process.argv.slice(2));
}
