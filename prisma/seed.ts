import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@task.com' },
    update: {},
    create: {
      email: 'admin@task.com',
      password,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@task.com' },
    update: {},
    create: {
      email: 'user@task.com',
      password,
    },
  });

  await prisma.task.createMany({
    data: [
      { title: 'Task 1', content: 'Content 1', userId: user.id },
      { title: 'Task 2', content: 'Content 2', userId: user.id },
      { title: 'Task 3', content: 'Content 3', userId: user.id },
      { title: 'Task 4', content: 'Content 4', userId: admin.id },
    ],
  });

  console.log('Seed concluído ✅');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
