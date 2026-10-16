import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';

const dayString = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const today = () => dayString(new Date());
const yesterday = () => dayString(new Date(Date.now() - 86_400_000));

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, 'User not found.');
  return {
    user: { id: user.id, email: user.email, displayName: user.displayName },
    streak: user.streak,
    lastActiveDay: user.lastActiveDay,
  };
}

// Server-side equivalent of settingsStore.markActiveToday:
// already active today -> no change; active yesterday -> streak + 1; else reset to 1.
export async function markActiveToday(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, 'User not found.');
  if (user.lastActiveDay === today()) {
    return { streak: user.streak, lastActiveDay: user.lastActiveDay };
  }
  const streak = user.lastActiveDay === yesterday() ? user.streak + 1 : 1;
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { streak, lastActiveDay: today() },
  });
  return { streak: updated.streak, lastActiveDay: updated.lastActiveDay };
}
