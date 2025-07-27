import AsciiTable from 'ascii-table';
import { ProbabilityCalculator } from './ProbabilityCalculator.js';

export class ProbabilityTable {
  constructor(diceList) {
    this.diceList = diceList;
  }

  render() {
    const table = new AsciiTable('Win Probability Matrix');

    const headers = ['vs'].concat(this.diceList.map((_, i) => `D${i + 1}`));
    table.setHeading(...headers);

    this.diceList.forEach((diceA, i) => {
      const row = [`D${i + 1}`];

      this.diceList.forEach((diceB, j) => {
        if (i === j) {
          row.push('-');
        } else {
          row.push(ProbabilityCalculator.getWinRate(diceA, diceB));
        }
      });

      table.addRow(...row);
    });

    return table.toString();
  }
}
