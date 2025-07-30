import { randomBytes, createHmac } from 'node:crypto';

export class HMACGenerator {
  static generate(secret, message) {
    return createHmac('sha256', secret).update(message).digest('hex');
  }

  static verify(secret, message, hmac) {
    const expected = this.generate(secret, message);
    return expected === hmac;
  }

  static generateSecret(bytes = 32) {
    return randomBytes(bytes).toString('hex');
  }
}
