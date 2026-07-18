const { prisma } = require('./src/lib/db.ts');
async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('USERS:', users);
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
