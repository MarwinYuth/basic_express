import { NextFunction, Request, Response } from "express";

export const superAdminOnly = async (req: Request, res: Response, next: NextFunction) => {
  if (req.currentUser.role !== "super_admin") return res.status(400).json({ message: req.__("flash.unauthorized") });
  next();
};
