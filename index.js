import { DiceParser } from './src/DiceParser.js';
import { Game } from './src/Game.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  node index.js <dice1> <dice2> ... <diceN>

Each dice must have 6 comma-separated integers.
Example:
  node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3

Optional:
  --help   Show this message
`);
  process.exit(0);
}

if (args.length < 3) {
  console.error('Error: You must provide at least 3 dice.');
  process.exit(1);
}

try {
  const diceList = DiceParser.parse(args);
  const game = new Game(diceList);
  await game.run();
} catch (err) {
  console.error(`Error: ${err.message}`);
  console.log(`
Example usage:
  node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
  node index.js 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6
`);
  process.exit(1);
}
