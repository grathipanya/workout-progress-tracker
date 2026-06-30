import { type Request, type Response } from "express";

import { Prisma } from "@database/generated/prisma/client";
import { registerUserService } from "@services/register.service";

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await registerUserService(req.body);
    res.json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
