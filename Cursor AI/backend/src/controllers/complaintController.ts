import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { z } from 'zod';

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export async function createComplaint(req: Request, res: Response) {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const userId = req.user!.id;
  const { title, description } = parse.data;
  const complaint = await prisma.complaint.create({
    data: {
      title,
      description,
      residentId: userId,
      history: { create: { status: 'NEW', changedByUserId: userId, comment: 'Created' } },
    },
  });
  res.status(201).json(complaint);
}

export async function listMyComplaints(req: Request, res: Response) {
  const userId = req.user!.id;
  const complaints = await prisma.complaint.findMany({
    where: { residentId: userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(complaints);
}

export async function getComplaintDetail(req: Request, res: Response) {
  const userId = req.user!.id;
  const id = req.params.id;
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { history: { orderBy: { createdAt: 'asc' } }, attachments: true },
  });
  if (!complaint) return res.status(404).json({ error: 'Not found' });
  if (req.user!.role !== 'ADMIN' && complaint.residentId !== userId)
    return res.status(403).json({ error: 'Forbidden' });
  res.json(complaint);
}

const adminFilterSchema = z.object({
  status: z.enum(['NEW', 'PENDING', 'RESOLVED']).optional(),
  residentId: z.string().optional(),
});

export async function adminListComplaints(req: Request, res: Response) {
  const parse = adminFilterSchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: 'Invalid query' });
  const { status, residentId } = parse.data;
  const complaints = await prisma.complaint.findMany({
    where: { status: status as any, residentId: residentId as any },
    orderBy: { createdAt: 'desc' },
  });
  res.json(complaints);
}

const statusSchema = z.object({
  status: z.enum(['NEW', 'PENDING', 'RESOLVED']),
  feedback: z.string().optional(),
  comment: z.string().optional(),
});

export async function adminUpdateStatus(req: Request, res: Response) {
  const id = req.params.id;
  const parse = statusSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const { status, feedback, comment } = parse.data;
  const userId = req.user!.id;

  const updated = await prisma.$transaction(async (tx) => {
    const complaint = await tx.complaint.update({ where: { id }, data: { status } });
    await tx.complaintHistory.create({
      data: { complaintId: id, status, feedback, comment, changedByUserId: userId },
    });
    await tx.notification.create({
      data: {
        userId: complaint.residentId,
        complaintId: complaint.id,
        type: 'STATUS_UPDATE',
        message: `Complaint status updated to ${status}`,
      },
    });
    return complaint;
  });

  res.json(updated);
}


