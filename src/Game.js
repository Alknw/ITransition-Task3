import readlineSync from 'readline-sync';
import { FairRNG } from './FairRNG.js';
import { ProbabilityTable } from './ProbabilityTable.js';

export class Game {
  constructor(diceList) {
    this.diceList = diceList;
    this.rng = new FairRNG();
    this.table = new ProbabilityTable(diceList);
  }

  start() {
    console.log("Let’s flip a coin to decide who goes first.");

    const toss = this.rng.getHMAC(2);
    console.log(`HMAC: ${toss.hmac}`);

    const input = readlineSync.question('Your call (0 or 1, or "x" to exit): ').toLowerCase();
    if (input === 'x' || input === 'exit') {
      console.log('Exiting.');
      return;
    }
    if (!['0', '1'].includes(input)) {
      console.log('Invalid input. Exiting.');
      return;
    }

    const userNum = parseInt(input);
    console.log(`Computer's number: ${toss.number}`);
    console.log(`Key: ${toss.key}`);

    const fairResult = this.rng.getFairIndex(userNum, toss.number, 2);
    const userGoesFirst = fairResult === 0;

    console.log(userGoesFirst ? 'You go first.' : 'Computer goes first.');

    let userDie, compDie;

    if (userGoesFirst) {
      userDie = this.askUserToPickDie(this.diceList);
      compDie = this.pickComputerDie(userDie);
    } else {
      compDie = this.pickComputerDie();
      console.log(`Computer picked die #${compDie}: [${this.diceList[compDie].join(', ')}]`);
      const remaining = this.diceList.filter((_, i) => i !== compDie);
      userDie = this.askUserToPickDie(remaining, compDie);
    }

    const compRoll = this.performRoll(compDie, 'Computer');
    const userRoll = this.performRoll(userDie, 'You');

    console.log(`\nComputer rolled: ${compRoll}`);
    console.log(`You rolled: ${userRoll}`);

    if (userRoll > compRoll) console.log("You win!");
    else if (userRoll < compRoll) console.log("Computer wins.");
    else console.log("It's a draw.");
  }

  askUserToPickDie(options, excludedIndex = null) {
    console.log('\nAvailable dice:');
    options.forEach((die, i) => {
      const actualIndex = excludedIndex !== null && i >= excludedIndex ? i + 1 : i;
      console.log(` ${actualIndex}: [${die.join(', ')}]`);
    });

    while (true) {
      const input = readlineSync.question('Pick a die number, "?" for help, or "x" to exit: ').toLowerCase();
      if (input === 'x' || input === 'exit') {
        console.log('Exiting.');
        process.exit();
      }
      if (input === '?') {
        this.table.render();
        continue;
      }
      const idx = parseInt(input);
      if (!isNaN(idx) && idx >= 0 && idx < this.diceList.length && (excludedIndex === null || idx !== excludedIndex)) {
        return idx;
      }
      console.log('Invalid selection.');
    }
  }

  pickComputerDie(excludeIdx = null) {
    const choices = this.diceList.map((_, i) => i).filter(i => i !== excludeIdx);
    return choices[this.rng.getRandomNumber(choices.length)];
  }

  performRoll(dieIndex, label) {
    const compPart = this.rng.getHMAC(6);
    console.log(`\n${label} HMAC: ${compPart.hmac}`);

    const input = readlineSync.question(`${label}, enter a number (from 0 to 5) or "x" to exit: `).toLowerCase();
    if (input === 'x' || input === 'exit') {
      console.log('Exiting.');
      process.exit();
    }

    const userNum = parseInt(input);
    if (isNaN(userNum) || userNum < 0 || userNum > 5) {
      console.log('Invalid input. Exiting.');
      process.exit();
    }

    const index = this.rng.getFairIndex(userNum, compPart.number, 6);
    console.log(`${label} key: ${compPart.key}`);
    console.log(`${label} computer number: ${compPart.number}`);
    console.log(`Result index: (${userNum} + ${compPart.number}) % 6 = ${index}`);

    return this.diceList[dieIndex][index];
  }
}
