import readlineSync from 'readline-sync';
import { FairRNG } from './FairRNG.js';
import { ProbabilityTable } from './ProbabilityTable.js';
import crypto from 'node:crypto';

export class Game {
  constructor(diceList) {
    this.diceList = diceList;
    this.table = new ProbabilityTable(diceList);
  }

  start() {
    console.log("Let's flip a coin to decide who goes first.");

    const toss = FairRNG.generateCoinTossHMAC();
    console.log(`HMAC: ${toss.hmac}`);
    const input = readlineSync.question('Guess (0 or 1): ').trim().toLowerCase();

    if (input === 'x') return;
    if (input === '?') {
      console.log('This is a fair coin toss. You must guess 0 or 1.\n');
      console.log(`HMAC: ${toss.hmac}`);
      console.log(`(HMAC is generated from computerBit = ${toss.computerBit} and secret key = ${toss.key})`);
      return;
    }

    const userCall = parseInt(input);
    if (![0, 1].includes(userCall)) {
      console.log('Invalid input. Enter 0 or 1.');
      return;
    }

    const { index: tossResult, proof } = FairRNG.generateFairIndex(toss.computerBit, userCall, 2);
    const userGoesFirst = tossResult === 0;

    console.log(`Key: ${toss.key}`);
    console.log(`Computer's bit: ${toss.computerBit}`);
    console.log(`Your call: ${userCall}`);
    console.log(`Fair result: ${proof.formula} → ${userGoesFirst ? 'You go first.' : 'Computer goes first.'}\n`);

    let userDieIndex, computerDieIndex;

    if (userGoesFirst) {
      userDieIndex = this.pickDie();
      if (userDieIndex === null) return;
      const remainingDice = this.diceList.filter((_, i) => i !== userDieIndex);
      computerDieIndex = this.pickRandomIndex(remainingDice.length);
      if (computerDieIndex >= userDieIndex) computerDieIndex++;
      console.log(`Computer picks die #${computerDieIndex}`);
    } else {
      computerDieIndex = this.pickRandomIndex(this.diceList.length);
      console.log(`Computer picks die #${computerDieIndex}`);
      const remainingDice = this.diceList.filter((_, i) => i !== computerDieIndex);
      userDieIndex = this.pickDie(remainingDice, computerDieIndex);
      if (userDieIndex === null) return;
    }

    const userRoll = this.performRoll(this.diceList[userDieIndex], 'Your');
    const computerRoll = this.performRoll(this.diceList[computerDieIndex], 'Computer');

    if (userRoll.value > computerRoll.value) {
      console.log('You win!');
    } else if (userRoll.value < computerRoll.value) {
      console.log('Computer wins!');
    } else {
      console.log('It\'s a draw!');
    }
  }

  pickDie(dice = this.diceList, offsetIndex = null) {
    console.log('Available dice:');
    dice.forEach((die, i) => {
      const index = offsetIndex !== null && i >= offsetIndex ? i + 1 : i;
      console.log(`  ${index}: [${die.join(', ')}]`);
    });

    while (true) {
      const input = readlineSync.question('Choose a die by number (? for help, x to exit): ').trim().toLowerCase();
      if (input === '?') {
        this.table.print();
        continue;
      }
      if (input === 'x') return null;

      const choice = parseInt(input);
      if (!isNaN(choice) && this.diceList[choice] && choice !== offsetIndex) {
        return choice;
      }
      console.log('Invalid choice.');
    }
  }

  performRoll(die, label) {
    console.log(`${label} roll:`);

    const hmacSeed = crypto.randomInt(0, 6);
    const userInput = readlineSync.questionInt('Enter a number (from 0 to 5) to participate in fair roll: ');
    const { index, proof } = FairRNG.generateFairIndex(userInput, hmacSeed, 6);
    const value = die[index];

    console.log(`  Your input: ${userInput}`);
    console.log(`  Computer number: ${hmacSeed}`);
    console.log(`  HMAC key: ${proof.key}`);
    console.log(`  HMAC: ${proof.hmac}`);
    console.log(`  Result formula: ${proof.formula}`);
    console.log(`  Rolled index: ${index}, value: ${value}\n`);

    return { index, value };
  }

  pickRandomIndex(length) {
    return crypto.randomInt(0, length);
  }
}
