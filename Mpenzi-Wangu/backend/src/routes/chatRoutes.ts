import { Router } from 'express';
import { sendChatMessage, getChatHistory } from '../controllers/chatController';

const router = Router();

router.post('/send', sendChatMessage);
router.get('/:coupleCode', getChatHistory);

export default router;