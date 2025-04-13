import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.task.createMany({
    data: [
      { title: 'Task 1', content: 'Content 1' },
      { title: 'Task 2', content: 'Content 2' },
      { title: 'Task 3', content: 'Content 3' },
      { title: 'Task 4', content: 'Content 4' },
    ],
  });

  console.log('Seed concluído ✅');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect().catch(() => {});
    process.exit(1);
  });
