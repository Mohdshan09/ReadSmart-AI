import bcrypt from 'bcryptjs';
import { prisma } from '../src/db/prisma.js';

// Optional: a demo account for local testing. Safe to re-run.
async function main() {
  const email = 'demo@readsmart.ai';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Demo user already exists, nothing to seed.');
    return;
  }
  await prisma.user.create({
    data: { email, passwordHash: await bcrypt.hash('password123', 10), displayName: 'Demo' },
  });
  console.log(`Seeded demo user → ${email} / password123`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    await prisma.$disconnect();
    // Re-throw so a failed seed exits with a non-zero code (unhandled rejection).
    throw err;
  });
