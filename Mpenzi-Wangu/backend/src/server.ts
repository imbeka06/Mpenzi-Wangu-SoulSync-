import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cycleRoutes from './routes/cycleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cycle', cycleRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({
    app: 'Mpenzi-Wangu API',
    status: 'Active 💕',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      cycle: '/api/cycle'
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Mpenzi-Wangu Backend operational 💕' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});