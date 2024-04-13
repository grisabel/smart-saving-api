const config = {
  ENV: process.env.ENV,
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
    URL_BASE: process.env.EMAIL_URL_BASE,
  },
  GOOGLE_FORM: {
    FORM_ID: process.env.GOOGLE_FORM_ID,
    FORM_FIELD_NAME: process.env.GOOGLE_FORM_FIELD_NAME,
    FORM_FIELD_EMAIL: process.env.GOOGLE_FORM_FIELD_EMAIL,
    FORM_FIELD_SUBJECT: process.env.GOOGLE_FORM_FIELD_SUBJECT,
    FORM_FIELD_DESCRIPTION: process.env.GOOGLE_FORM_FIELD_DESCRIPTION,
  },
};

// console.log({ config });

export default config;
