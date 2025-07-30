// src/CLI.js
import readlineSync from 'readline-sync';
import Table from 'ascii-table';

export class CLI {
  showHMAC(hmac) {
    console.log(`HMAC: ${hmac}`);
  }

  askBinaryChoice() {
    while (true) {
      const input = readlineSync.question('Enter your choice (0 or 1), X to exit, ? for help: ').trim();
      if (['0', '1', 'X', '?'].includes(input.toUpperCase())) return input.toUpperCase();
      console.log('Invalid input. Enter 0, 1, X or ?');
    }
  }

  showSecret(secret) {
    console.log(`Secret key: ${secret}`);
  }

  showCoinTossResult(userChoice, computerChoice, winner) {
    console.log(`You chose ${userChoice}, computer chose ${computerChoice}`);
    console.log(`${winner === 'user' ? 'You' : 'Computer'} go first.`);
  }

  showDiceList(diceList) {
    console.log('\nAvailable dice:');
    diceList.forEach((dice, index) => {
      console.log(`[${index}] ${JSON.stringify(dice)}`);
    });
  }

  askDiceSelection(prompt, validIndexes) {
    while (true) {
      const input = readlineSync.question(prompt).trim().toUpperCase();
      if (input === 'X' || input === '?') return input;
      const num = Number(input);
      if (!Number.isNaN(num) && validIndexes.includes(num)) return num;
      console.log('Invalid input.');
    }
  }

  showComputerDiceSelection(index, dice) {
    console.log(`Computer selected die [${index}]: ${JSON.stringify(dice)}`);
  }

  showHMACCommitment(hmac) {
    console.log(`\nHMAC of computer's number: ${hmac}`);
    console.log('Add your number modulo 6.');
    console.log('0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help');
  }

  askUserNumberForRoll() {
    while (true) {
      const input = readlineSync.question('Your selection: ').trim().toUpperCase();
      if (['0','1','2','3','4','5','X','?'].includes(input)) return input;
      console.log('Invalid input.');
    }
  }

  showReveal(secret, computerNumber, userNumber, resultIndex) {
    console.log(`My number is ${computerNumber} (KEY=${secret}).`);
    console.log(`The fair number generation result is ${computerNumber} + ${userNumber} = ${resultIndex} (mod 6).`);
  }

  showRollResult(owner, value) {
    console.log(`${owner} roll result is ${value}.`);
  }

  showWinner(winner, userRoll, computerRoll) {
    if (userRoll > computerRoll) {
      console.log('You win (' + userRoll + ' > ' + computerRoll + ')!');
    } else if (userRoll < computerRoll) {
      console.log('Computer wins (' + computerRoll + ' > ' + userRoll + ').');
    } else {
      console.log(`It's a draw (${userRoll} = ${computerRoll})!`);
    }
  }

  showProbabilityTable(probTable) {
    const table = new Table('Dice Win Rates');
    table.setHeading('', ...probTable.map((_, i) => `D${i}`));
    probTable.forEach((row, i) => {
      table.addRow(`D${i}`, ...row.map(p => `${(p * 100).toFixed(1)}%`));
    });
    console.log(table.toString());
  }

  exit() {
    console.log('Exiting...');
    process.exit(0);
  }
}
