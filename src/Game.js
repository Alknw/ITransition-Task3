import { CLI } from './CLI.js';
import { HMACGenerator } from './HMACGenerator.js';
import { ProbabilityTable } from './ProbabilityTable.js';
import { FairRandomGenerator } from './FairRandomGenerator.js';

export class Game {
  constructor(diceList) {
    this.diceList = diceList;
    this.cli = new CLI();
  }

  async run() {
    console.log('\n--- Fair Coin Toss ---');
    const secretKey = HMACGenerator.generateKey();
    const coin = HMACGenerator.getFairBit(secretKey);
    console.log('HMAC:', coin.hmac);
    const userBit = await this.cli.question('Enter your guess (0 or 1): ');

    const userGoesFirst = userBit === coin.bit;
    console.log('Secret key:', secretKey);
    console.log(`Computer's bit: ${coin.bit}`);
    console.log(userGoesFirst ? 'You go first!' : 'Computer goes first.');

    let userDice, computerDice;
    while (true) {
      this.cli.showMenu(this.diceList.length);
      const choice = await this.cli.question('\nEnter your choice: ');
      const index = parseInt(choice, 10) - 1;

      if (index < 0 || index >= this.diceList.length + 2 || isNaN(index)) {
        console.log('Invalid choice.');
        continue;
      }

      if (index === this.diceList.length) {
        const table = new ProbabilityTable(this.diceList).render();
        this.cli.printHelp(table);
        continue;
      }

      if (index === this.diceList.length + 1) {
        console.log('Goodbye!');
        this.cli.close();
        return;
      }

      userDice = this.diceList[index];
      computerDice = this.diceList.find((_, i) => i !== index);
      break;
    }

    const userSeed = await this.cli.question('Enter your random seed (any string): ');
    const computerSeed = HMACGenerator.generateKey();

    const userRollIndex = FairRandomGenerator.generate(userSeed, computerSeed, 6);
    const computerRollIndex = FairRandomGenerator.generate(computerSeed, userSeed, 6);

    const userRoll = userDice.roll(userRollIndex);
    const computerRoll = computerDice.roll(computerRollIndex);

    console.log(`\nYou rolled: ${userRoll}`);
    console.log(`Computer rolled: ${computerRoll}`);

    if (userRoll > computerRoll) {
      console.log('You win!');
    } else if (userRoll < computerRoll) {
      console.log('Computer wins!');
    } else {
      console.log('It\'s a draw!');
    }

    this.cli.close();
  }
}
