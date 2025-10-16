import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const username = process.argv[2];
const password = process.argv[3];

async function createUser() {
  if (!username || !password) {
    console.log('Usage: node createUser.js <username> <password>');
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.users.create({
    data: {
      username,
      password: hashed,
      first_name: 'Admin',
      last_name: 'Admin',
    },
  });

  console.log(`User ${username} created!`);
}

createUser();
