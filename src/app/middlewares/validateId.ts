import { NextFunction, Request, Response } from "express";

const validateId = (req: Request, res: Response, next: NextFunction) => {
  const idParams = Object.keys(req.params).filter((param) => param.endsWith("id"));
  for (const param of idParams) {
    const id = req.params[param];
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: req.__("flash.notFound") });
    }
  }

  next();
};

export default validateId;
