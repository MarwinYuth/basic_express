import jwt from "jsonwebtoken";
import { authConfig } from ".";

const config = authConfig as any;

export const generateToken = (user: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        email: user.email,
        id: user.id
      },
      config.secret,
      {
        algorithm: config.algorithms[0],
        expiresIn: "48h"
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        if (!token) {
          return new Error("Empty token");
        }

        return resolve(token);
      }
    );
  });
};

export const verifyToken = async (token: string) => jwt.verify(token, config.secret);

export const clearSession = (token: any) => {
  redis.set(token, "invoke");
};
