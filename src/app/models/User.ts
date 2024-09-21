import { Model } from "objection";

class User extends Model {
  static tableName = "users";

  id!: number;
  username!: string;
  email!: string;
  password!: string;
  token!: string;
  reset!: string;
  created_at!: Date;
  updated_at!: Date;
}

export default User;
