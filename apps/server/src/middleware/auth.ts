import { send } from "@utils/response.utils";
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "@utils/jwt";

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) return send.unauthorized(res, "No token provided");

  try {
    const { userId, role, email } = verifyAccessToken(token);

    (req as any).userId = userId;
    (req as any).role = role;
    (req as any).email = email;

    next();
  } catch (error) {
    return send.unauthorized(res, "Authentication failed");
  }
};

export const refreshTokenValidation = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return send.unauthorized(res, "No refresh token provided");

  try {
    const { userId, role, email } = verifyRefreshToken(refreshToken);

    (req as any).userId = userId;
    (req as any).role = role;
    (req as any).email = email;

    next();
  } catch (error) {
    console.error("Invalid or expired refresh token: ", error);
    return send.unauthorized(res, "Invalid or expired refresh token");
  }
};
