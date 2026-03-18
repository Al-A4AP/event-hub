import { Router } from 'express';
import * as dashCtrl from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, roleMiddleware(['ORGANIZER']));

router.get('/stats', dashCtrl.getStats);
router.get('/events', dashCtrl.getDashboardEvents);
router.get('/events/:eventId/attendees', dashCtrl.getEventAttendees);

export default router;
