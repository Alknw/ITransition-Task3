import crypto from 'crypto';

export class FairRandomGenerator {
  static generate(seed1, seed2, max) {
    const combined = crypto
      .createHash('sha256')
      .update(seed1 + seed2)
      .digest('hex');
    const number = parseInt(combined.slice(0, 8), 16);
    return number % max;
  }
}
