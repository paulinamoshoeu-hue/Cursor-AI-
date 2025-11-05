import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export async function listMyNotifications(req: Request, res: Response) {
  const userId = req.user!.id;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(notifications);
}

export async function markNotificationRead(req: Request, res: Response) {
  const userId = req.user!.id;
  const id = req.params.id;
  const notif = await prisma.notification.findUnique({ where: { id } });
  if (!notif || notif.userId !== userId) return res.status(404).json({ error: 'Not found' });
  await prisma.notification.update({ where: { id }, data: { read: true } });
  res.json({ ok: true });
}

export async function markAllNotificationsRead(req: Request, res: Response) {
  const userId = req.user!.id;
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  res.json({ ok: true });
}
