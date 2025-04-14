import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('P4$sw0rd!', 10);

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password,
      role: 'USER',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
    },
  });

  await prisma.task.createMany({
    data: [
      { title: 'Write documentation', content: 'Finish writing API docs.', userId: user.id },
      { title: 'Fix login bug', content: 'Resolve 500 error on login route.', userId: user.id },
      { title: 'Review pull request', content: 'Review PR #42 and approve it.', userId: user.id },
      { title: 'Create admin panel', content: 'Start building the admin dashboard.', userId: admin.id },
      { title: 'Deploy staging app', content: 'Deploy current version to staging.', userId: admin.id },
      { title: 'Test Stripe integration', content: 'Ensure payments work end-to-end.', userId: admin.id },
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
