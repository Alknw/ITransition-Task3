import readline from 'readline';
import chalk from 'chalk';

export class CLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  question(query) {
    return new Promise(resolve => this.rl.question(query, resolve));
  }

  showMenu(diceCount) {
    console.log(chalk.blue('\nChoose your dice:'));
    for (let i = 0; i < diceCount; i++) {
      console.log(`${i + 1}. Dice #${i + 1}`);
    }
    console.log(`${diceCount + 1}. Help`);
    console.log(`${diceCount + 2}. Exit`);
  }

  printHelp(table) {
    console.log(chalk.green('\nProbability Table:'));
    console.log(table);
  }

  close() {
    this.rl.close();
  }
}
