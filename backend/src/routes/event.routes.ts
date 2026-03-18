import { Router } from 'express';
import * as eventCtrl from '../controllers/event.controller';
import * as reviewCtrl from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Public
router.get('/', eventCtrl.getEvents);
router.get('/categories', eventCtrl.getCategories);
router.get('/:id', eventCtrl.getEventById);
router.get('/:eventId/reviews', reviewCtrl.getEventReviews);

// Organizer-only
router.post('/', authMiddleware, roleMiddleware(['ORGANIZER']), eventCtrl.createEvent);
router.put('/:id', authMiddleware, roleMiddleware(['ORGANIZER']), eventCtrl.updateEvent);
router.patch('/:id/publish', authMiddleware, roleMiddleware(['ORGANIZER']), eventCtrl.publishEvent);
router.delete('/:id', authMiddleware, roleMiddleware(['ORGANIZER']), eventCtrl.deleteEvent);
router.get('/organizer/my-events', authMiddleware, roleMiddleware(['ORGANIZER']), eventCtrl.getOrganizerEvents);

// Customer-only (review)
router.post('/:eventId/reviews', authMiddleware, roleMiddleware(['CUSTOMER']), reviewCtrl.createReview);

export default router;
