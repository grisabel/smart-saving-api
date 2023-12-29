const config = {
  JWT: {
    ACCESS_TOKEN: {
      EXPIRES_TIME: '15m',
      PRIVATE_KEY: process.env.ACCESS_TOKEN_KEY,
    },
    REFRESH_TOKEN: {
      EXPIRES_TIME: '1d',
      PRIVATE_KEY: process.env.REFRESH_TOKEN_KEY,
    },
  },
  EMAIL: {
    API_KEY: process.env.EMAIL_API_KEY,
  },
};

console.log(config);

export default config;
