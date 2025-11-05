import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listMyNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notificationController.js';
import { adminSummary } from '../controllers/dashboardController.js';
import {
  createComplaint,
  listMyComplaints,
  getComplaintDetail,
  adminListComplaints,
  adminUpdateStatus,
} from '../controllers/complaintController.js';
import { upload } from '../middleware/upload.js';
import { addAttachment, listAttachments } from '../controllers/attachmentController.js';

const router = Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);

// Resident
router.post('/complaints', requireAuth, requireRole(['RESIDENT']), createComplaint);
router.get('/complaints', requireAuth, requireRole(['RESIDENT']), listMyComplaints);
router.get('/complaints/:id', requireAuth, getComplaintDetail);
router.get('/complaints/:id/attachments', requireAuth, listAttachments);
router.post('/complaints/:id/attachments', requireAuth, upload.single('file'), addAttachment);

// Admin
router.get('/admin/complaints', requireAuth, requireRole(['ADMIN']), adminListComplaints);
router.patch('/admin/complaints/:id/status', requireAuth, requireRole(['ADMIN']), adminUpdateStatus);
router.get('/admin/summary', requireAuth, requireRole(['ADMIN']), adminSummary);

// Notifications
router.get('/notifications', requireAuth, listMyNotifications);
router.post('/notifications/:id/read', requireAuth, markNotificationRead);
router.post('/notifications/read-all', requireAuth, markAllNotificationsRead);

export default router;


