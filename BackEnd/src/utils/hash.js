// src/services/hash.js
import bcrypt from 'bcrypt';

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);

export const hashPassword = async (password) => {
  // Let bcrypt generate the salt internally; provide rounds directly.
  const hash = await bcrypt.hash(password, saltRounds);
  // bcrypt embeds the salt in the resulting hash, so returning salt separately is unnecessary.
  return { hash };
};

export const verifyPassword = async (password, hash) => {
  // returns true if match, false otherwise
  return await bcrypt.compare(password, hash);
};
