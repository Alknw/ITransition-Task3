import readline from 'readline';
import chalk from 'chalk';

export class CLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  printWelcome() {
    console.log(chalk.green('\n🎲 Welcome to the Fair Dice Game!\n'));
  }

  showDiceOptions(diceList) {
    console.log(chalk.blue('Available Dice Options:'));
    diceList.forEach((dice, index) => {
      console.log(`  ${index + 1}. [${dice.faces.join(', ')}]`);
    });
  }

  prompt(question) {
    return new Promise(resolve => this.rl.question(question, resolve));
  }

  printHelp(table) {
    console.log(chalk.green('\nProbability Table:'));
    console.log(table);
  }

  close() {
    this.rl.close();
  }
}
