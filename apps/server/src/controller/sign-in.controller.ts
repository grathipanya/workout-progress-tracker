import { AppError } from "@errors/app-error";
import { AUTH_ERRORS } from "@errors/auth.errors";
import { signInService } from "@services/sign-in.service";
import { type Request, type Response } from "express";

export const signInController = async (req: Request, res: Response) => {
  try {
    const signInResponse = await signInService(req.body);
    res.json(signInResponse);
  } catch (error) {
    if (error instanceof AppError) {
      switch (error.code) {
        case AUTH_ERRORS.USER_NOT_FOUND:
          return res.status(400).json({ error: "User not found" });
        case AUTH_ERRORS.INVALID_PASSWORD:
          return res.status(400).json({ error: "Invalid password" });
        default:
          return res.status(500).json({ error: "Internal server error" });
      }
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
