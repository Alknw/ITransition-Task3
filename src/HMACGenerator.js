import crypto from 'crypto';

export class HMACGenerator {
  static generate(secret, message) {
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
  }

  static verify(secret, message, hmac) {
    const expected = this.generate(secret, message);
    return expected === hmac;
  }

  static generateSecret(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
