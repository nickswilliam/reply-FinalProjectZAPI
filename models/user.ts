import { Model, Schema, model } from "mongoose";
import { ROLES } from "../helpers/constants";

export interface IUSer {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
  code?: string;
  verified?: boolean;
}

const UserSchema = new Schema<IUSer>({
  nombre: {
    type: "String",
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: "String",
    required: [true, "El email es obligatorio"],
  },
  password: {
    type: "String",
    required: [true, "La contraseña es obligatorio"],
  },
  rol: {
    type: "String",
    default: ROLES.user,
  },
  code: {
    type: "String",
  },
  verified: {
    type: "Boolean",
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, code, ...user } = this.toObject();
  return user;
}; // Esta funcion solo va a retornar el usuario

const User: Model<IUSer> = model<IUSer>("User", UserSchema);
export default User;
