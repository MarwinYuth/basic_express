import { NextFunction, Request, Response } from "express";
import Website from "~/app/models/Website";


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentWebsite: Website;
    }
  }
}

const validateWebsite = async (req: Request, res: Response, next: NextFunction) => {
  const website_slug = req.headers['website-slug'] || req.headers['Website-Slug'];
  
  if (!website_slug) return res.status(404).json({ message: "flash.websiteNotFound" });
  const website = await Website.query()
    .modify("userAccessibleWebsites", req.currentUser)
    .where("slug", website_slug)
    .first();

  if (!website) return res.status(404).json({ message: "flash.websiteNotFound" });

  req.currentWebsite = website;
  next();
};

export default validateWebsite;
