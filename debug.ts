const { prisma } = require('./src/lib/db.ts');
async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('USERS:', users);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.error('ERROR:', errorMessage);
  } finally {
    await prisma.$disconnect();
  }
}
test();
