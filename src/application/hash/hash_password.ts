import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, saltOrRounds);
}
