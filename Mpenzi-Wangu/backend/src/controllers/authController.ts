import { Request, Response } from 'express';
import { db } from '../config/firebase';

// Generates a random 6-character love code (e.g., "LOVE26")
const generateCoupleCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createCoupleCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, partnerName } = req.body;
    const coupleCode = generateCoupleCode();

    const coupleRef = db.collection('couples').doc(coupleCode);
    await coupleRef.set({
      coupleCode,
      partner1Id: userId,
      partner1Name: partnerName || 'Love',
      partner2Id: null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      coupleCode,
      message: `Share code ${coupleCode} with your love to link your apps! 💕`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const joinCoupleCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, coupleCode, partnerName } = req.body;

    const coupleRef = db.collection('couples').doc(coupleCode.toUpperCase());
    const doc = await coupleRef.get();

    if (!doc.exists) {
      res.status(404).json({ success: false, message: 'Invalid Love Passcode!' });
      return;
    }

    const data = doc.data();
    if (data?.partner2Id) {
      res.status(400).json({ success: false, message: 'This couple room is already full!' });
      return;
    }

    await coupleRef.update({
      partner2Id: userId,
      partner2Name: partnerName || 'Love',
      status: 'connected',
    });

    res.status(200).json({
      success: true,
      message: 'Successfully linked with your love! 💕',
      coupleCode,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};