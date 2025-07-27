import crypto from 'crypto';

export class HMACGenerator {
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  static getFairBit(secret) {
    const bit = Math.floor(Math.random() * 2).toString();
    const hmac = crypto.createHmac('sha256', secret).update(bit).digest('hex');
    return { bit, hmac };
  }
}
