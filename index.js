import { DiceParser } from './src/DiceParser.js';
import { Game } from './src/Game.js';
import { CLI } from './src/CLI.js';

const args = process.argv.slice(2);

if (args.length < 3 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage:
  node index.js <dice#1> <dice#2> ... <dice#X>

Each die must have 6 comma-separated integrs.
You should input atleast 3 dice.

Examples:
  node index.js 1,2,3,4,5,6 2,3,4,5,6,7 1,1,3,3,5,5
`);
  process.exit(0);
}

try {
  const diceList = DiceParser.parse(args);
  const cli = new CLI();
  const game = new Game(diceList, cli);
  await game.run();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
