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
//const ADMIN_CORS = process.env.ADMIN_CORS || ".*,*.akeno.pl";

// CORS to avoid issues when consuming Medusa from a client
//const STORE_CORS = process.env.STORE_CORS || ".*,*.akeno.pl";

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
     {
   	resolve: `medusa-file-minio`,
    	options: {
        endpoint: process.env.MINIO_ENDPOINT,
        bucket: process.env.MINIO_BUCKET,
        access_key_id: process.env.MINIO_ACCESS_KEY,
        secret_access_key: process.env.MINIO_SECRET_KEY,
       },
     },
     {	
	resolve: `medusa-plugin-sendgrid`,
	options: {
	api_key: process.env.SENDGRID_API_KEY,
  	from: "akeno@akeno.pl",
	order_placed_template:"d-7d7d2f67ad3d4025930c7093271f9984",		
       },
     },	     
];

module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    database_extra: { ssl: { rejectUnauthorized: false } },
  },
  plugins,
};
