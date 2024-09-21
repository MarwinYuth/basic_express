import { checkSchema } from "express-validator";

export const loginValidator = checkSchema({
  email: {
    in: ["body"],
    isEmail: true,
    custom: {
      options: (value, { req }) => {
        console.log(value);
        
        if (!value?.trim()) return Promise.reject("not empty");
        return value;
      }
    }
  },
  password: {
    in: ["body"],
    notEmpty: true,
    errorMessage: "not empty"
  }
});
