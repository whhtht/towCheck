import http from 'http';
import app from './app.js';
import { startTowMonitor } from './routes/tow/tow.email.js';

const port = 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at port:${port}`);
});

startTowMonitor();

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
