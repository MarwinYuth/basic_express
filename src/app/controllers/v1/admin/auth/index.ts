import { Request, Response } from "express";
import User from "~/app/models/User";
import { userSelectionSerializer } from "~/app/serializers/admin/user";

export const registerValidator = async (req: Request, res: Response) => {
  try {
    
    res.status(200).json({message: "work"})
  } catch (error) {
    res.status(400).json({ message: "internalError" });
  }
};

export const register = async (req: Request, res: Response) => {
    try {
      const params = req.parameters.permit("email", "password").value();
      const user = await User.query().insertAndFetch(params)
        

      res.status(200).json({data: userSelectionSerializer(user)})
    } catch (error) {
      res.status(400).json({ message: "internalError" });
    }
  };
  