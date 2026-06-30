const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretExpiresIn: process.env.JWT_SECRET_EXPIRES_IN,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshSecretExpiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
};

export default authConfig;
