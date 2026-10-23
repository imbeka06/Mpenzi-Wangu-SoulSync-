import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const updateCycle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode, userId, lastPeriodDate, cycleLength, periodLength, currentPhase, symptoms, empathyTip } = req.body;

    const cycleRef = db.collection('couples').doc(coupleCode.toUpperCase()).collection('cycleLogs').doc('current');
    
    await cycleRef.set({
      userId,
      lastPeriodDate,
      cycleLength: cycleLength || 28,
      periodLength: periodLength || 5,
      currentPhase: currentPhase || 'Follicular Phase',
      symptoms: symptoms || [],
      empathyTip: empathyTip || 'Keep a warm drink handy and offer cozy comfort!',
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true, message: 'Cycle updated & synced with your love! 💕' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCycle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { coupleCode } = req.params;
    const cycleRef = db.collection('couples').doc(coupleCode.toUpperCase()).collection('cycleLogs').doc('current');
    const doc = await cycleRef.get();

    if (!doc.exists) {
      res.status(404).json({ success: false, message: 'No cycle log found' });
      return;
    }

    res.status(200).json({ success: true, cycle: doc.data() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};