import { Router } from 'express';
import { triggerSos, getSosStatus, resolveSos } from '../controllers/sosController';

const router = Router();

router.post('/trigger', triggerSos);
router.get('/:coupleCode', getSosStatus);
router.post('/resolve', resolveSos);

export default router;