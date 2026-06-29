import { type Request, type Response, type NextFunction } from "express";
import { getErrorMessage } from "../utils/errors";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(500).json({
    error: getErrorMessage(err),
  });

  next(err);
};

export default errorHandler;
