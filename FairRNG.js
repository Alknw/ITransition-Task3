import { randomBytes } from 'node:crypto';
import { HMACGenerator } from './HMACGenerator.js';

export class FairRNG {
  getHMAC() {
    const number = randomBytes(1)[0];
    const key = HMACGenerator.generateSecret(16);
    const hmac = HMACGenerator.generate(key, number.toString());
    return { number, key, hmac };
  }

  getFairIndex(userNum, compNum, modulo) {
    return (userNum + compNum) % modulo;
  }
}
