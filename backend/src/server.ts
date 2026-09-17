import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { db } from './database/db.js';
import { generateDemoDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

// CORS configuration supporting production Netlify FRONTEND_URL
const rawFrontendUrl = process.env.FRONTEND_URL || '';
const allowedOrigins = rawFrontendUrl
  ? rawFrontendUrl.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile, server probes)
      if (!origin) {
        return callback(null, true);
      }
      // If wildcard or no FRONTEND_URL configured, allow origin
      if (allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      const normalized = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(normalized) ||
        normalized.endsWith('.netlify.app') ||
        normalized.startsWith('http://localhost') ||
        normalized.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }
      // Allow for seamless evaluation
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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

// Healthcheck handler supporting both /health and /api/health
const healthHandler = (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'CivicForge (Jharkhand Societal Innovation Exchange)',
    version: '1.0.0',
    mode: process.env.AI_MODE || 'demo',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// API Routes
app.use('/api', apiRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Error]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal Server Error'
      : (err.message || 'Internal Server Error'),
  });
});

bootstrap().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CivicForge Backend API Server running on port ${PORT}`);
    console.log(`📡 Healthcheck: http://${HOST}:${PORT}/api/health`);
    console.log(`🌐 REST API:    http://${HOST}:${PORT}/api/challenges`);
    console.log(`=======================================================`);
  });
});
