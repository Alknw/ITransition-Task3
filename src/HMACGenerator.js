import crypto from 'crypto';

export class HMACGenerator {
  static compute(message, key) {
    return crypto.createHmac('sha3-256', key).update(String(message)).digest('hex');
  }
}
