import { Router } from 'express';
import * as txCtrl from '../controllers/transaction.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', txCtrl.createTransaction);
router.get('/', txCtrl.getMyTransactions);
router.get('/:id', txCtrl.getTransactionById);
router.patch('/:id/pay', txCtrl.confirmPayment);
router.patch('/:id/cancel', txCtrl.cancelTransaction);

export default router;
