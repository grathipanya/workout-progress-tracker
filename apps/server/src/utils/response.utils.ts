import { type Response } from "express";

export const send = {
  success(res: Response, data: unknown, message = "success") {
    return res.status(200).json({
      ok: true,
      message,
      data,
    });
  },

  error(res: Response, data: unknown, message = "error") {
    // A generic 500 Internal Server Error is returned for unforeseen issues
    return res.status(500).json({
      ok: false,
      message,
      data,
    });
  },

  notFound(res: Response, data: unknown, message = "not found") {
    // 404 is for resources that don't exist
    return res.status(404).json({
      ok: false,
      message,
      data,
    });
  },

  unauthorized(res: Response, data: unknown, message = "unauthorized") {
    // 401 for unauthorized access (e.g., invalid token)
    return res.status(401).json({
      ok: false,
      message,
      data,
    });
  },

  validationErrors(res: Response, errors: Record<string, string[]>) {
    // 422 for validation issues
    return res.status(422).json({
      ok: false,
      message: "Validation error",
      errors,
    });
  },

  forbidden(res: Response, data: unknown, message = "forbidden") {
    // 403 for forbidden access
    return res.status(403).json({
      ok: false,
      message,
      data,
    });
  },

  badRequest(res: Response, data: unknown, message = "bad request") {
    // 400 for general bad request errors
    return res.status(400).json({
      ok: false,
      message,
      data,
    });
  },
};
