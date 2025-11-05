import { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response) {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const { email, password } = parse.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role: 'RESIDENT' } });
  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(req: Request, res: Response) {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const { email, password } = parse.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}


