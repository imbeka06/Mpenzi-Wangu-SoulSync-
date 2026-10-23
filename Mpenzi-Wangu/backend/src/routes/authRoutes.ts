import { Router } from 'express';
import { createCoupleCode, joinCoupleCode } from '../controllers/authController';

const router = Router();

router.post('/create-code', createCoupleCode);
router.post('/join-code', joinCoupleCode);

export default router;