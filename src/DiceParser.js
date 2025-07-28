import { Dice } from './Dice.js';

export class DiceParser {
  static parse(input) {
    if (input.length < 3) throw new Error('At least 3 dice are required.');
    if (input.length > 9) throw new Error('Too many dice (maximum is 9).');

    return input.map((s, i) => {
      const faces = s.split(',').map(n => {
        const num = Number(n.trim());
        if (!Number.isInteger(num)) throw new Error(`Invalid face in dice ${i + 1}: "${n}"`);
        return num;
      });

      if (faces.length !== 6) {
        throw new Error(`Dice ${i + 1} must have exactly 6 faces.`);
      }

      return new Dice(faces);
    });
  }
}
