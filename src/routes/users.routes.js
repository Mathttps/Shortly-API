import { Router } from "express";
import { validateSchema } from "../middlewares/validateMid.js";
import { authValidation } from "../middlewares/authMid.js";
import { userLoginSchema, userSchema } from "../schemas/users.schemas.js";
import { getUrlsByUser, signIn, signUp } from "../controllers/users.controller.js";


const usersRouter = Router();

usersRouter.get("/ranking");
usersRouter.get("/users/me", authValidation, getUrlsByUser);
usersRouter.post("/signup", validateSchema(userSchema), signUp);
usersRouter.post("/signin", validateSchema(userLoginSchema), signIn);


export default usersRouter;
