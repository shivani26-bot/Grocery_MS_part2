const dotEnv = require("dotenv"); // This package helps manage environment variables by loading them from a .env file into process.env.

// If it’s not in production mode, it loads an environment file specific to that environment, like .env.dev for developmen
if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  // In the case where the environment is production, it defaults to loading the .env file
  dotEnv.config();
}

//export environment variable
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
  QUEUE_NAME: "CUSTOMER_QUEUE",
};
