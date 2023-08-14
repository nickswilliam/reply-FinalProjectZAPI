import { Router } from "express";
import { login, register, verifyUser } from "../controllers/auth";
import { check } from "express-validator";
import { recolectErrors } from "../middlewares/recolectError";
import { existsEmail } from "../helpers/validationsDB";

const router = Router();

router.post(
  "/register",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check(
      "password",
      "La contraseña debe ser de 6 caracteres como mínimo"
    ).isLength({ min: 6 }),

    //validacion custom
    check("email").custom(existsEmail),
    //middleware custom
    recolectErrors,
  ],

  register
);

router.patch(
  "/verify",
  [
    check("email", "El email es requerido").isEmail(),
    check("code", "El código de verificación es requerido").not().isEmpty(),
    recolectErrors,
  ],
  verifyUser
);

router.post(
  "/login",
  [
    check("email", "El email es requerido").isEmail(),
    check(
      "password",
      "La contraseña debe ser de 6 caracteres como mínimo"
    ).isLength({ min: 6 }),
    recolectErrors,
  ],
  login
);

export default router;
