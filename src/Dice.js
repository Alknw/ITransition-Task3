export class Dice {
  constructor(faces) {
    if (!Array.isArray(faces) || faces.length !== 6 || !faces.every(Number.isInteger)) {
      throw new Error('Dice must have 6 faces');
    }
    this.faces = faces;
  }

  roll(index) {
    return this.faces[index % 6];
  }
}
