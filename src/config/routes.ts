import { Express, Request, Response } from "express";
import router from "~/routes/api";
// import { MulterFileExtension } from "~/app/helper/errors";
import params from "strong-parameter";
import i18n from "./i18n";
import useragent from "express-useragent";
// import { getIpInfoMiddleware } from "~/lib/express-ip";

require("express-async-errors");

export default (app: Express) => {
  app.use(params.expressMiddleware());
  // app.use(getIpInfoMiddleware);
  app.use(useragent.express());
  app.use((req, _res, next) => {
    let language = req.headers["accept-language"] || "en";
    if (!["en", "km"].includes(language)) {
      language = "en";
    }
    req.headers["accept-language"] = language;
    next();
  });
  app.use(i18n.init);
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ message: `Knock Knock, I'm home` });
  });
  app.use("/v1", router);

  app.use((req, res) => {
    return res.status(404).json({ message: `Route ${req.url} Not found.` });
  });

  // app.use((err: any, _req: Request, res: Response) => {
  //   if (err instanceof MulterFileExtension) {
  //     return res.status(400).json(err.message);
  //   }

  //   return res.status(500).json({ message: err.message });
  // });
};
