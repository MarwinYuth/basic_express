import express, { NextFunction, Request, Response } from "express";
import * as controller from "~/app/controllers/v1/admin/auth";
import errorValidator from "~/app/middlewares/errorValidator";
import { loginValidator } from "~/app/validators/admin/auth";
import { errorSerialize } from "~/app/validators/base";

const router = express.Router();

const middleware = (req: Request, res: Response, next: NextFunction) => {
    const company =req.headers["company"];

    if(company !== "aasa"){
        return res.status(400).json({ message: "error ...." });
    }

    next()
};

router.route("/admin/auth/register").post(loginValidator, errorValidator, controller.register);



// router.route("/admin/auth").post(middleware, controller.login);


export default router;
