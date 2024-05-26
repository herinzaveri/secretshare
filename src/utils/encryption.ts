import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export async function encryptText(text: string) {
  const key = crypto.randomBytes(16).toString('hex');
  const initVector = crypto.randomBytes(16);
  const initVectorHex = initVector.toString('hex');

  const cipher = crypto.createCipheriv(
      algorithm,
      key,
      initVector,
  );

  const encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

  return {encryptedText, key, iv: initVectorHex};
}

export async function decryptText(text: string, key: string, iv: string) {
  const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, 'hex'),
  );

  const decryptedText = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');

  return {decryptedText};
}
