export class ProbabilityCalculator {
  static getWinRate(diceA, diceB) {
    let aWins = 0;
    let total = diceA.faces.length * diceB.faces.length;

    for (const a of diceA.faces) {
      for (const b of diceB.faces) {
        if (a > b) aWins++;
      }
    }

    return (aWins / total).toFixed(2);
  }
}
