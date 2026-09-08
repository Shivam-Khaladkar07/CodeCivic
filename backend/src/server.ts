import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { db } from './database/db.js';
import { generateDemoDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize DB and Seed if empty
async function bootstrap() {
  try {
    db.init();
    const existingChallenges = db.getTable('challenges');
    if (!existingChallenges || existingChallenges.length === 0) {
      console.log('[Bootstrap] No challenges found in DB. Seeding realistic Jharkhand dataset (~300 challenges, 20 HEIs, 50 faculty)...');
      const seed = await generateDemoDatabase();
      db.init(seed);
      console.log('[Bootstrap] Database seeded successfully!');
    } else {
      console.log(`[Bootstrap] Found ${existingChallenges.length} challenges in DB. Ready.`);
    }
  } catch (err) {
    console.error('[Bootstrap] Error during database initialization:', err);
  }
}

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'CivicForge (Jharkhand Societal Innovation Exchange)',
    version: '1.0.0',
    mode: process.env.AI_MODE || 'demo',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', apiRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

bootstrap().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CivicForge Backend API Server running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://localhost:${PORT}/health`);
    console.log(`🌐 REST API:    http://localhost:${PORT}/api/challenges`);
    console.log(`=======================================================`);
  });
});
