import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { errorSerialize, groupBy } from "~/app/helper/utils";
import { deleteObject } from "~/config/uploader";

export default async (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = groupBy(result.array(), "path");
    const errorsMessage = errorSerialize(errors);
    await deleteObject(req.file?.filename || "");
    return res.status(400).json({
      errors: errorsMessage,
      message: req.__("flash.invalidData")
    });
  }

  next();
};
