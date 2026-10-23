import { Router } from 'express';
import { updateCycle, getCycle } from '../controllers/cycleController';

const router = Router();

router.post('/update', updateCycle);
router.get('/:coupleCode', getCycle);

export default router;