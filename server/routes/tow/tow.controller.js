import { Router } from 'express';

export class TowController {
  constructor() {
    this.path = '/';
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', (req, res) => {
      res.status(200).send('Tow monitoring running');
    });
  }
}
