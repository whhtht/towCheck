import { Router } from 'express';

export class HealthCheckController {
  constructor() {
    this.path = '/';
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', (req, res) => {
      res.status(200).send('OK');
    });
  }
}
