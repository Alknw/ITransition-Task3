import { randomBytes } from 'node:crypto';
import { HMACGenerator } from './HMACGenerator.js';

export class FairRNG {
  getRandomNumber(range) {
    const byte = randomBytes(1)[0];
    return byte % range;
  }

  getHMAC(range = 6) {
    const number = this.getRandomNumber(range);
    const key = HMACGenerator.generateSecret(16);
    const hmac = HMACGenerator.generate(key, number.toString());
    return { number, key, hmac };
  }

  getFairIndex(userNum, compNum, modulo) {
    return (userNum + compNum) % modulo;
  }
}
