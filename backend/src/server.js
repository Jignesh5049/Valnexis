const app = require('./app');
const connectDb = require('./config/db');
const env = require('./config/env');
const logger = require('./config/logger');

async function bootstrap() {
  await connectDb();
  app.listen(env.port, () => {
    logger.info(`Valnexis backend listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to bootstrap application', { message: error.message, stack: error.stack });
  process.exit(1);
});
