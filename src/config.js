const {
  PORT = 4000,
  MONGO_URL = "mongodb://localhost/campk12_live",
  REDIS_URL_HOST = "localhost",
} = process.env;
module.exports = {
  SERVER: {
    PORT,
  },
  MONGO_URL,
  REDIS_URL_HOST,
};
