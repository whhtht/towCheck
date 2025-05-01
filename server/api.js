import { Router } from 'express';
import healthCheckRoute from './routes/healthCheck/healthCheck.router.js';
import towRouter from './routes/tow/tow.router.js';

const router = Router();

router.use('/health', healthCheckRoute);
router.use('/tow', towRouter);

export default router;
