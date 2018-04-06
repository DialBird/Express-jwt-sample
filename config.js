module.exports = {
  'secret': 'oauthServerSampleSecret',
  'database': `mongodb://${process.env.MONGO_PORT_27017_TCP_ADDR}/jwt_server`,
};
