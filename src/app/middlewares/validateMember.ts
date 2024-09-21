import { NextFunction, Request, Response } from "express";
import UserOrganization from "~/app/models/UserOrganization";

export const validateMember = async (req: Request, res: Response, next: NextFunction) => {
  const isMember = await UserOrganization.query().findOne({
    user_id: req.currentUser.id,
    organization_id: req.params.org_id
  });

  if (!isMember) return res.status(400).json({ message: req.__("flash.invalidOrg") });
  
  next();
};
