const dotenv = require('dotenv')

let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'production':
		ENV_FILE_NAME = '.env.production';
		break;
	case 'staging':
		ENV_FILE_NAME = '.env.staging';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	case 'development':
	default:
		ENV_FILE_NAME = '.env';
		break;
}

try {
	dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });
} catch (e) {
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "https://akeno-admin-pl.netlify.app";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "https://akeno-pl.netlify.app";

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://postgres:rslh6zBr7HuWAdGX4R1Z@containers-us-west-84.railway.app:7453/railway";

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://default:xtwTl029gEfo37ovJcbU@containers-us-west-181.railway.app:6808";

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,

     {
       resolve: `medusa-payment-stripe`,
       options: {
         api_key: process.env.STRIPE_API_KEY,
         webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
       },
     },
];

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: "postgres",
    //database_database: "./medusa-db.sql",
    // database_type: "sqlite",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
    database_extra: { ssl: { rejectUnauthorized: false } },
  },
  plugins,
};
