import User from "~/app/models/User";
import { pick } from "../../helper/utils";

export const userSelectionSerializer = (user: User) => {
  return pick(user, ["id", "username", "email"]);
};
