const {
  PORT = 4000,
  MONGO_URL = "mongodb://localhost/campk12_live",
} = process.env;
module.exports = {
  SERVER: {
    PORT,
  },
  MONGO_URL,
};
