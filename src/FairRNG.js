import { HMACGenerator } from './HMACGenerator.js';

export class FairRNG {
  constructor(possibleValues) {
    this.values = possibleValues;
    this.mod = possibleValues.length;
  }

  prepareComputerCommit() {
    this.computerNumber = Math.floor(Math.random() * this.mod);
    this.secret = HMACGenerator.generateSecret();
    this.hmac = HMACGenerator.generate(this.secret, this.computerNumber.toString());
    return this.hmac;
  }

  resolve(userNumber) {
    if (typeof userNumber !== 'number' || userNumber < 0 || !Number.isInteger(userNumber)) {
      throw new Error('Invalid user input: must be a non-negative integer.');
    }

    const finalIndex = (this.computerNumber + userNumber) % this.mod;
    const value = this.values[finalIndex];

    return {
      value,
      index: finalIndex,
      computerNumber: this.computerNumber,
      secret: this.secret,
      hmac: this.hmac,
      isVerified: HMACGenerator.verify(this.secret, this.computerNumber.toString(), this.hmac)
    };
  }
}
