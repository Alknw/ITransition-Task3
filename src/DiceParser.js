import { Dice } from './Dice.js';

export class DiceParser {
  static parse(inputArgs) {
    if (inputArgs.length < 3) {
      throw new Error('Please provide at least 3 dice.');
    }

    const diceList = inputArgs.map((arg, i) => {
      const faces = arg.split(',').map(n => {
        const parsed = parseInt(n, 10);
        if (isNaN(parsed)) {
          throw new Error(`Dice ${i + 1} contains non-integer values.`);
        }
        return parsed;
      });

      if (faces.length !== 6) {
        throw new Error(`Dice ${i + 1} must have exactly 6 faces.`);
      }

      return new Dice(faces);
    });

    return diceList;
  }
}
