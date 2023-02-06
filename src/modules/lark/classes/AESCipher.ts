import * as crypto from 'crypto';

export class AESCipher {
  constructor(private readonly key) {
    const hash = crypto.createHash('sha256');
    hash.update(this.key);
    this.key = hash.digest();
  }

  decrypt(encrypted: string) {
    const encryptBuffer = Buffer.from(encrypted, 'base64');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.key,
      encryptBuffer.slice(0, 16),
    );

    let decrypted = decipher.update(
      encryptBuffer.slice(16).toString('hex'),
      'hex',
      'utf8',
    );

    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
