import { Router } from "express";
import { postNewIssue } from "../controllers/issue";
import { validateJWT } from "../middlewares/validateJWT";
import { isAdmin } from "../middlewares/validateRol";
import { check } from "express-validator";
import { recolectErrors } from "../middlewares/recolectError";

const router = Router()

router.post("/", [
    validateJWT,
    isAdmin,
    check("title", "El titulo es requerido").not().isEmpty(),
    check("description", "La descripción es requerida").not().isEmpty(),
    check("priority", "La prioridad es requerida").not().isEmpty(),
    recolectErrors
], postNewIssue)

export default router