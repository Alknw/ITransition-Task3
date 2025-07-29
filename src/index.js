import { DiceParser } from './DiceParser.js';
import { Game } from './Game.js';

function main() {
  const args = process.argv.slice(2);
  let dice;

  try {
    dice = DiceParser.parse(args);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }

  const game = new Game(dice);
  game.start();
}

main();
