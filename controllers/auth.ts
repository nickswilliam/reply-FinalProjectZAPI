import { Request, Response } from "express";
import User, { IUSer } from "../models/user";
import bcryptjs from "bcryptjs";
import { ROLES } from "../helpers/constants";
import randomstring from "randomstring";
import { sendEmail } from "../mailer/mailer";
import { generateJWT } from "../helpers/generateJWT";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password, rol }: IUSer = req.body;

  const usuario = new User({ nombre, email, password, rol });

  //creamos el salto para la generación de pass encriptada, por default son 10 saltos
  const salt = bcryptjs.genSaltSync();

  //guardamos el usuario con contraseña encriptada
  usuario.password = bcryptjs.hashSync(password, salt);

  const adminKey = req.headers["admin-key"];

  if (adminKey === process.env.KEYFORADMIN) {
    usuario.rol = ROLES.admin;
  }

  const newCode = randomstring.generate(6);

  usuario.code = newCode;

  await usuario.save();

  await sendEmail(email, newCode);

  res.status(201).json({
    usuario,
  });
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "No se encontró el email en la base de datos",
      });
      return;
    }

    if (user.verified) {
      res.status(400).json({
        message: "El usuario ya está verificado",
      });
      return;
    }

    if (user.code !== code) {
      res.status(401).json({
        message: "El código ingresado es incorrecto",
      });
      return;
    }

    await User.findOneAndUpdate({ email }, { verified: true });

    res.status(200).json({
      message: "Usuario verificado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: IUSer = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "No se encontró el email del usuario en la base de datos",
      });
      return;
    }

    const validatePassword = bcryptjs.compareSync(password, user.password);
    if (!validatePassword) {
      res.status(400).json({
        message: "La contraseña es incorrecta",
      });
      return;
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};
