import express from "express";

export const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.headers["x-api-key"]; //todo implement jwt auth

  if (apiKey !== process.env.API_KEY) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};
