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
    const toss = this.rng.getHMAC();
    console.log(`HMAC: ${toss.hmac}`);

    const input = readlineSync.question('Your call (0 or 1): ');
    if (input.toLowerCase() === 'exit') return;
    if (!['0', '1'].includes(input)) {
      console.log('Invalid input. Exiting.');
      return;
    }

    const userNum = parseInt(input);
    console.log(`Computer's number: ${toss.number % 2}`);
    console.log(`Key: ${toss.key}`);

    const result = this.rng.getFairIndex(userNum, toss.number % 2, 2);
    const userGoesFirst = result === 0;
    console.log(userGoesFirst ? 'You go first.' : 'Computer goes first.');

    let userDieIndex, compDieIndex;

    if (userGoesFirst) {
      userDieIndex = this.askUserToPickDie(this.diceList);
      compDieIndex = this.pickComputerDie(userDieIndex);
    } else {
      compDieIndex = this.pickComputerDie();
      const compDie = this.diceList[compDieIndex];
      console.log(`Computer picked die #${compDieIndex}: [${compDie.join(', ')}]`);
      userDieIndex = this.askUserToPickDie(this.diceList.filter((_, i) => i !== compDieIndex), compDieIndex);
    }

    const compRoll = this.performRoll(compDieIndex, 'Computer');
    const userRoll = this.performRoll(userDieIndex, 'You');

    console.log(`\nComputer rolled: ${compRoll}`);
    console.log(`You rolled: ${userRoll}`);

    if (userRoll > compRoll) console.log('You win!');
    else if (userRoll < compRoll) console.log('Computer wins.');
    else console.log('It\'s a draw.');
  }

  askUserToPickDie(options, excludedIndex = null) {
    console.log('\nAvailable dice:');
    options.forEach((die, i) => {
      const originalIndex = excludedIndex !== null && i >= excludedIndex ? i + 1 : i;
      console.log(` ${originalIndex}: [${die.join(', ')}]`);
    });

    while (true) {
      const input = readlineSync.question('Pick a die by number, "?" for help, or "exit": ');
      if (input === 'exit') process.exit();
      if (input === '?') {
        this.table.render();
        continue;
      }
      const num = parseInt(input);
      const validIndices = options.map((_, i) => excludedIndex !== null && i >= excludedIndex ? i + 1 : i);
      if (!isNaN(num) && validIndices.includes(num)) return num;
      console.log('Invalid selection.');
    }
  }

  pickComputerDie(excludeIdx = null) {
    const availableIndices = this.diceList.map((_, i) => i).filter(i => i !== excludeIdx);
    const hmac = this.rng.getHMAC();
    const choiceIndex = hmac.number % availableIndices.length;
    return availableIndices[choiceIndex];
  }

  performRoll(dieIndex, label) {
    const hmac = this.rng.getHMAC();
    console.log(`\n${label} HMAC: ${hmac.hmac}`);

    const input = readlineSync.question(`${label}, enter a number (0-5) or "exit": `);
    if (input.toLowerCase() === 'exit') process.exit();

    const userNum = parseInt(input);
    if (isNaN(userNum) || userNum < 0 || userNum > 5) {
      console.log('Invalid number. Exiting.');
      process.exit();
    }

    const finalIndex = this.rng.getFairIndex(userNum, hmac.number % 6, 6);
    console.log(`${label} key: ${hmac.key}`);
    console.log(`(${userNum} + ${hmac.number % 6}) % 6 = ${finalIndex}`);
    return this.diceList[dieIndex][finalIndex];
  }
}
