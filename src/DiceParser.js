export class DiceParser {
  static parse(args) {
    if (args.length < 3) {
      throw new Error(
        "Invalid input: You must specify at least 3 dice.\n" +
        "Example: node src/index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3"
      );
    }

    const dice = args.map((arg, index) => {
      const parts = arg.split(',');
      const faces = parts.map(num => {
        const val = Number(num);
        if (!Number.isInteger(val)) {
          throw new Error(
            `Invalid face in die #${index + 1}: "${num}" is not an integer.\n` +
            "Example: 1,2,3,4,5,6"
          );
        }
        return val;
      });
      return faces;
    });

    const faceCount = dice[0].length;
    const allSameLength = dice.every(d => d.length === faceCount);
    if (!allSameLength) {
      throw new Error("Invalid input: All dice must have the same number of faces.");
    }

    return dice;
  }
}
