import crypto from 'crypto';

export class FairRNG {
  static generateFairIndex(computerNumber, userInput, range = 6) {
    if (typeof range !== 'number' || range <= 0) {
      throw new Error(`Invalid range: ${range}. Must be greater than 0.`);
    }

    const key = crypto.randomBytes(32).toString('hex');
    const hmac = crypto.createHmac('sha256', key).update(String(computerNumber)).digest('hex');
    const index = (userInput + computerNumber) % range;

    return {
      index,
      proof: {
        hmac,
        key,
        computerNumber,
        userInput,
        formula: `(${userInput} + ${computerNumber}) % ${range} = ${index}`
      }
    };
  }

  static generateCoinTossHMAC() {
    const computerBit = crypto.randomInt(0, 2);
    const key = crypto.randomBytes(32).toString('hex');
    const hmac = crypto.createHmac('sha256', key).update(String(computerBit)).digest('hex');

    return {
      computerBit,
      hmac,
      key
    };
  }
}
