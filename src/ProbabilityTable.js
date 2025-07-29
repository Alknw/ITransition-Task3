import Table from 'cli-table3';

export class ProbabilityTable {
  constructor(diceList) {
    this.diceList = diceList;
  }

  calculateProbabilities() {
    const n = this.diceList.length;
    const table = Array.from({ length: n }, () => Array(n).fill('-'));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;

        let winCount = 0;
        const dieA = this.diceList[i];
        const dieB = this.diceList[j];

        for (const faceA of dieA) {
          for (const faceB of dieB) {
            if (faceA > faceB) winCount++;
          }
        }

        const total = dieA.length * dieB.length;
        const probability = (winCount / total) * 100;
        table[i][j] = `${probability.toFixed(1)}%`;
      }
    }

    return table;
  }

  render() {
    const headers = [''].concat(this.diceList.map((_, i) => `D${i + 1}`));
    const table = new Table({ head: headers });

    const probabilities = this.calculateProbabilities();

    for (let i = 0; i < this.diceList.length; i++) {
      const row = [`D${i + 1}`].concat(probabilities[i]);
      table.push(row);
    }

    console.log('\nWin Probability Table:');
    console.log(table.toString());
  }
}
