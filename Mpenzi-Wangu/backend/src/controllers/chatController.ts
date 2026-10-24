import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const sendChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode, senderId, text, reaction } = req.body;
    const code = Array.isArray(coupleCode) ? coupleCode[0] : coupleCode;

    if (!code || !text) {
      res.status(400).json({ success: false, message: 'Couple code and message text are required' });
      return;
    }

    const messagesRef = db.collection('couples').doc(code.toUpperCase()).collection('messages');
    
    const newMessage = {
      senderId,
      text,
      reaction: reaction || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await messagesRef.add(newMessage);

    res.status(201).json({ success: true, messageId: docRef.id, message: 'Love note sent! 💕' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode } = req.params;
    const code = Array.isArray(coupleCode) ? coupleCode[0] : coupleCode;

    if (!code) {
      res.status(400).json({ success: false, message: 'Couple code is required' });
      return;
    }

    const snapshot = await db
      .collection('couples')
      .doc(code.toUpperCase())
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({ success: true, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};