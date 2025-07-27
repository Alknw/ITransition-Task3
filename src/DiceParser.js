import { Dice } from './Dice.js';

export class DiceParser {
  static parse(input) {
    const diceStrings = typeof input === 'string' ? input.trim().split(/\s+/) : input;

    if (diceStrings.length < 3) {
      throw new Error('At least 3 dice are required.');
    }

    if (diceStrings.length > 9) {
      throw new Error('Too many dice (maximum is 9).');
    }

    const diceList = diceStrings.map((s, i) => {
      const faces = s.split(',').map(n => {
        const num = parseInt(n.trim(), 10);
        if (isNaN(num)) {
          throw new Error(`Non-integer value detected in dice ${i + 1}: "${n}"`);
        }
        return num;
      });

      if (faces.length !== 6) {
        throw new Error(`Dice ${i + 1} must have exactly 6 faces.`);
      }

      return new Dice(faces);
    });

    return diceList;
  }
}
