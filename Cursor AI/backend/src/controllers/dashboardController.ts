import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export async function adminSummary(req: Request, res: Response) {
  const [newCount, pendingCount, resolvedCount, totalResidents] = await Promise.all([
    prisma.complaint.count({ where: { status: 'NEW' } }),
    prisma.complaint.count({ where: { status: 'PENDING' } }),
    prisma.complaint.count({ where: { status: 'RESOLVED' } }),
    prisma.user.count({ where: { role: 'RESIDENT' } }),
  ]);
  res.json({
    new: newCount,
    pending: pendingCount,
    resolved: resolvedCount,
    totalResidents,
  });
}


