import { CLI } from './CLI.js';
import { FairRNG } from './FairRNG.js';
import { ProbabilityTable } from './ProbabilityTable.js';

export class Game {
  constructor(diceList) {
    this.diceList = diceList;
  }

  start() {
    CLI.print('\n--- Generalized Non-Transitive Dice Game ---');

    const tossRNG = new FairRNG([0, 1]);
    const tossHMAC = tossRNG.prepareComputerCommit();
    CLI.showCoinTossHMAC(tossHMAC);

    const userCoinInput = CLI.promptUserNumber("Enter your number for coin toss (e.g. 0 or any integer):");
    const tossResult = tossRNG.resolve(userCoinInput);
    CLI.showCoinTossReveal(tossResult.secret, tossResult.computerNumber, tossResult.isVerified);

    const userGoesFirst = (tossResult.value === 1);
    CLI.print(userGoesFirst ? "\nYou won the coin toss. You choose your die first." : "\nComputer won the coin toss. It chooses first.");

    let userDieIndex, computerDieIndex;

    if (userGoesFirst) {
      while (true) {
        const choice = CLI.chooseDie(this.diceList);
        if (choice === 'quit') return CLI.print("Game exited.");
        if (choice === 'help') {
          const pt = new ProbabilityTable(this.diceList);
          pt.render();
          continue;
        }
        userDieIndex = choice;
        break;
      }

      const options = this.diceList.map((_, i) => i).filter(i => i !== userDieIndex);
      computerDieIndex = options[Math.floor(Math.random() * options.length)];
    } else {
      computerDieIndex = Math.floor(Math.random() * this.diceList.length);
      while (true) {
        const choice = CLI.chooseDie(this.diceList, computerDieIndex);
        if (choice === 'quit') return CLI.print("Game exited.");
        if (choice === 'help') {
          const pt = new ProbabilityTable(this.diceList);
          pt.render();
          continue;
        }
        userDieIndex = choice;
        break;
      }
    }

    CLI.print(`\nYour die: [${this.diceList[userDieIndex].join(', ')}]`);
    CLI.print(`Computer die: [${this.diceList[computerDieIndex].join(', ')}]`);

    const userRollRNG = new FairRNG(this.diceList[userDieIndex]);
    const userRollHMAC = userRollRNG.prepareComputerCommit();
    CLI.print(`\nComputer committed to your roll using HMAC: ${userRollHMAC}`);
    const userInputRoll = CLI.promptUserNumber("Enter your number for your roll:");
    const userRoll = userRollRNG.resolve(userInputRoll);
    CLI.showRollResult("Your", userRoll);

    const cpuRollRNG = new FairRNG(this.diceList[computerDieIndex]);
    const cpuRollHMAC = cpuRollRNG.prepareComputerCommit();
    CLI.print(`\nComputer committed to its own roll using HMAC: ${cpuRollHMAC}`);
    const userInputForCPU = CLI.promptUserNumber("Enter your number to generate computer's roll:");
    const cpuRoll = cpuRollRNG.resolve(userInputForCPU);
    CLI.showRollResult("Computer", cpuRoll);

    if (userRoll.value > cpuRoll.value) {
      CLI.print("\nYou win!");
    } else if (userRoll.value < cpuRoll.value) {
      CLI.print("\nComputer wins.");
    } else {
      CLI.print("\nIt's a draw.");
    }
  }
}
