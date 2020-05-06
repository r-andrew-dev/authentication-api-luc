console.log('this is loaded');

exports.keys = {
  jwt_secret: process.env.JWT_SECRET,
  mongo_local_conn: process.env.MONGO_LOCAL_CONN_URL,

  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,

  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  from_email: process.env.FROM_EMAIL
};