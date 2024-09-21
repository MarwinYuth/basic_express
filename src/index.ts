import express from "express";
import morgan from "morgan";
import objection, { Model } from "objection";
import paranoia from "objection-paranoia";
import routes from "~/config/routes";
import redis from "~/config/redis";
import knexConfig from "~/config/database";
import path from "path";

declare global {
   
  var redis: any;
}

export const bootstrap = () => {
  const app = express();
   
  const http = require("http").Server(app);
  const environment = process.env.NODE_ENV || "development";
  const PORT = process.env.PORT || 5002;
   
  const db = require("knex")(knexConfig[environment]);

  const productionLog =
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms - :res[content-length] ":referrer" ":user-agent"';
  const logMode = app.get("env") === "development" ? "dev" : productionLog;

  app.set("trust proxy", true);
  app.use(morgan(logMode));
  // app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "../public")));

  paranoia.register(objection);
  Model.knex(db);
  routes(app);

  const server = http.listen(PORT, async () => {
    await redis.connect();
    global.redis = redis;
    console.log(`Server now listening at localhost: ${PORT}`);
  });

  server.on("close", () => {
    console.log("Closed express server");

    db.pool.end(() => {
      console.log("Shut down connection pool");
    });
  });
};

if (process.env.CLUSTER_ENABLE != "true") {
  bootstrap();
}
