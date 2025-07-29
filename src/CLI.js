import readlineSync from 'readline-sync';

export class CLI {
  static promptUserNumber(label = 'Enter a number:') {
    while (true) {
      const input = readlineSync.question(`${label} `);
      const num = Number(input);

      if (Number.isInteger(num) && num >= 0) {
        return num;
      }

      console.log("Invalid input. Please enter a non-negative integer.");
    }
  }

  static chooseDie(diceList, excludeIndex = null) {
    while (true) {
      console.log('\nAvailable dice:');
      diceList.forEach((die, index) => {
        const note = index === excludeIndex ? ' (taken)' : '';
        console.log(`${index + 1}: [${die.join(', ')}]${note}`);
      });
      console.log('H: Help');
      console.log('Q: Quit');

      const input = readlineSync.question('Choose a die: ').trim().toUpperCase();

      if (input === 'H') {
        return 'help';
      }

      if (input === 'Q') {
        return 'quit';
      }

      const idx = parseInt(input, 10);
      if (Number.isInteger(idx) && idx >= 1 && idx <= diceList.length) {
        if (idx - 1 === excludeIndex) {
          console.log("This die is already taken. Choose another.");
        } else {
          return idx - 1;
        }
      } else {
        console.log("Invalid input. Try again.");
      }
    }
  }

  static showCoinTossHMAC(hmac) {
    console.log(`\nCoin toss:`);
    console.log(`Computer has committed to a bit using HMAC: ${hmac}`);
  }

  static showCoinTossReveal(secret, number, verified) {
    console.log(`\nReveal:`);
    console.log(`Computer's bit: ${number}`);
    console.log(`Secret: ${secret}`);
    console.log(`HMAC valid: ${verified ? 'YES' : 'NO'}`);
  }

  static showRollResult(playerName, { value, computerNumber, secret, hmac, isVerified }) {
    console.log(`\n${playerName} roll result:`);
    console.log(`  Final value: ${value}`);
    console.log(`  Computer number: ${computerNumber}`);
    console.log(`  Secret: ${secret}`);
    console.log(`  HMAC: ${hmac}`);
    console.log(`  HMAC valid: ${isVerified ? 'YES' : 'NO'}`);
}

  static print(text) {
    console.log(text);
  }
}
