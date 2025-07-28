import crypto from 'crypto';

export class FairRandomGenerator {
  static commit(max) {
    const value = crypto.randomInt(max);
    const secret = crypto.randomBytes(32).toString('hex');
    const hmac = crypto.createHmac('sha256', secret)
                       .update(value.toString())
                       .digest('hex');
    return { value, secret, hmac };
  }

  static verify(hmac, value, secret) {
    return hmac === crypto.createHmac('sha256', secret)
                          .update(value.toString())
                          .digest('hex');
  }

  static mix(user, computer, max) {
    return (user + computer) % max;
  }
}
