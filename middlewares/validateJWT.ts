import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUSer } from "../models/user";

export const validateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["x-token"] as string;

  if (!token) {
    res.status(401).json({
      message: "No hay token en la peticion.",
    });
    return;
  }

  try {
    const secretKey = process.env.SECRETPASS as string;
    const payload = jwt.verify(token, secretKey) as JwtPayload;

    const { id } = payload;

    const userConfirmed: IUSer | null = await User.findById(id);

    if (!userConfirmed) {
      res.status(401).json({
        message: "Token no válido.",
      });
      return;
    }

    req.body.userConfirmed = userConfirmed;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Token no válido",
    });
  }
};
