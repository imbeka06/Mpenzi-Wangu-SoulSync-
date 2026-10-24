import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const triggerSos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode, userId, message, latitude, longitude } = req.body;
    const code = Array.isArray(coupleCode) ? coupleCode[0] : coupleCode;

    if (!code) {
      res.status(400).json({ success: false, message: 'Couple code is required' });
      return;
    }

    const sosRef = db.collection('couples').doc(code.toUpperCase()).collection('sosAlerts').doc('active');
    
    await sosRef.set({
      userId,
      message: message || 'Urgent Care Alert triggered! Please check on me.',
      latitude: latitude || null,
      longitude: longitude || null,
      active: true,
      triggeredAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true, message: 'SOS Care alert broadcasted successfully! 🚨' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSosStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode } = req.params;
    const code = Array.isArray(coupleCode) ? coupleCode[0] : coupleCode;

    if (!code) {
      res.status(400).json({ success: false, message: 'Couple code is required' });
      return;
    }

    const sosRef = db.collection('couples').doc(code.toUpperCase()).collection('sosAlerts').doc('active');
    const doc = await sosRef.get();

    if (!doc.exists) {
      res.status(200).json({ success: true, active: false });
      return;
    }

    res.status(200).json({ success: true, alert: doc.data() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resolveSos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode } = req.body;
    const code = Array.isArray(coupleCode) ? coupleCode[0] : coupleCode;

    if (!code) {
      res.status(400).json({ success: false, message: 'Couple code is required' });
      return;
    }

    const sosRef = db.collection('couples').doc(code.toUpperCase()).collection('sosAlerts').doc('active');
    await sosRef.update({ active: false, resolvedAt: new Date().toISOString() });

    res.status(200).json({ success: true, message: 'SOS Alert resolved safely. ❤️' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};