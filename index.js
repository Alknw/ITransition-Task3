import { DiceParser } from './src/DiceParser.js';
import { Game } from './src/Game.js';

const args = process.argv.slice(2);

try {
  const diceList = DiceParser.parse(args);
  const game = new Game(diceList);
  await game.run();
} catch (error) {
  console.error('Error:', error.message);
  console.log('Example usage:\n  node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3');
}
