require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initSocket } = require('./socket');
const { sequelize } = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established.');

    // Sync models in development only
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database synced.');
    }

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
})();
