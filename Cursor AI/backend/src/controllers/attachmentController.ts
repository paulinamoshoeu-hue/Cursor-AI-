import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';

export async function addAttachment(req: Request, res: Response) {
	const complaintId = req.params.id;
	if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
	const userId = req.user!.id;
	const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
	if (!complaint) return res.status(404).json({ error: 'Not found' });
	if (req.user!.role !== 'ADMIN' && complaint.residentId !== userId)
		return res.status(403).json({ error: 'Forbidden' });
	const att = await prisma.attachment.create({
		data: {
			complaintId,
			filePath: req.file.path,
			fileName: req.file.originalname,
			mimeType: req.file.mimetype,
		},
	});
	res.status(201).json(att);
}

export async function listAttachments(req: Request, res: Response) {
	const complaintId = req.params.id;
	const userId = req.user!.id;
	const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
	if (!complaint) return res.status(404).json({ error: 'Not found' });
	if (req.user!.role !== 'ADMIN' && complaint.residentId !== userId)
		return res.status(403).json({ error: 'Forbidden' });
	const atts = await prisma.attachment.findMany({ where: { complaintId }, orderBy: { createdAt: 'desc' } });
	res.json(atts);
}
