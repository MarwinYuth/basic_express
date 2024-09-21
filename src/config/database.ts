import "dotenv/config";
import pg from "pg";

const { setTypeParser, builtins } = pg.types;
const typesToReset = [builtins.DATE, builtins.TIME, builtins.TIMETZ, builtins.TIMESTAMP, builtins.TIMESTAMPTZ];
function resetPgDateParsers() {
  for (const pgType of typesToReset) {
    setTypeParser(pgType, (val: string) => String(val)); // like noParse() function underhood pg lib
  }
  setTypeParser(builtins.INT8, (value: string) => Number(value));
  setTypeParser(builtins.NUMERIC, (value: string) => Number(value));
}

resetPgDateParsers();
const connection = {
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME
  },
  pool: { min: 0, max: 10 }
};

const rootPath = process.cwd();
const migrations = {
  migrations: {
    directory: rootPath + "/src/db/migrations"
  },
  seeds: {
    directory: rootPath + "/src/db/seeds"
  }
};

export default {
  development: {
    ...connection,
    ...migrations
  } as any,

  production: {
    ...connection,
    ...migrations,
    pool: {
      min: 2,
      max: 50
    }
  }
} as any;
