import { FairRandomGenerator } from './FairRandomGenerator.js';
import { ProbabilityTable } from './ProbabilityTable.js';

export class Game {
  constructor(diceList, cli) {
    this.diceList = diceList;
    this.cli = cli;
  }

  async run() {
    this.cli.printWelcome();
    this.cli.showDiceOptions(this.diceList);

    let userIndex;
    while (true) {
      const input = await this.cli.prompt(`Select your die (1-${this.diceList.length}) or type "help": `);
      if (input.toLowerCase() === 'help') {
        this.showProbabilities();
        continue;
      }
      const i = parseInt(input, 10);
      if (i >= 1 && i <= this.diceList.length) {
        userIndex = i - 1;
        break;
      }
      console.log('Invalid input.');
    }

    const userDice = this.diceList[userIndex];
    const computerDice = this.diceList.find((_, i) => i !== userIndex);

    const { value: compValue, secret, hmac } = FairRandomGenerator.commit(2);

    const input = await this.askValidNumber(`Enter random number (0-1): `, 0, 1);

    const fairIndex = FairRandomGenerator.mix(parseInt(input), compValue, computerDice.faces.length);

    const userRoll = userDice.roll(0);
    const compRoll = computerDice.roll(fairIndex);

    console.log(`\nHMAC: ${hmac}`);
    console.log(`Reveal: value = ${compValue}, secret = ${secret}`);

    console.log(`You rolled: ${userRoll}`);
    console.log(`Computer rolled: ${compRoll}`);

    console.log(
      userRoll > compRoll ? 'You won!' :
      userRoll < compRoll ? 'Computer won!' :
      'Draw!'
    );

    this.cli.close();
  }

  async askValidNumber(prompt, min, max) {
    while (true) {
      const input = await this.cli.prompt(prompt);
      const n = parseInt(input, 10);
      if (n >= min && n <= max) return n;
      console.log('Invalid number.');
    }
  }

  showProbabilities() {
    console.log('\n--- Dice Win Probability Table ---');
    console.log(new ProbabilityTable(this.diceList).render());
  }
}
