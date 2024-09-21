import { NextFunction, Request, Response } from "express";
import PostType from "~/app/models/PostType";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentPostType: PostType;
    }
  }
}

const validatePostType = async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.post_type_slug;

  if (!slug) return res.status(404).json({ message: "flash.postTypeNotFound" });
  const postType = await PostType.query().findOne({ slug, website_id: req.currentWebsite.id});

  if (!postType) return res.status(404).json({ message: "flash.postTypeNotFound" });

  req.currentPostType = postType;
  next();
};

export default validatePostType;
