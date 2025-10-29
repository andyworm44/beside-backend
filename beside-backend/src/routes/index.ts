import { Express } from 'express';
import authRoutes from './auth';
import signalRoutes from './signals';
import userRoutes from './users';

export const setupRoutes = (app: Express) => {
  // API prefix
  const API_PREFIX = '/api/v1';

  // Routes
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/signals`, signalRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);

  console.log('✅ Routes configured');
};
