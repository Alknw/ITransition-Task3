export class Dice {
  constructor(faces) {
    this.faces = faces;
  }

  roll(randomIndex) {
    return this.faces[randomIndex % this.faces.length];
  }
}
