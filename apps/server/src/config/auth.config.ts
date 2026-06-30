const authConfig = {
  secret: process.env.AUTH_SECRET,
  expiresIn: process.env.AUTH_SECRET_EXPIRES_IN,
  refreshSecret: process.env.AUTH_REFRESH_SECRET,
  refreshExpiresIn: process.env.AUTH_REFRESH_SECRET_EXPIRES_IN,
};

export default authConfig;
