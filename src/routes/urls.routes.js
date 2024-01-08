import { Router } from "express";
import { urlSchema } from "../schemas/urls.schemas.js";
import { validateSchema } from "../middlewares/validateMid.js";
import { authValidation } from "../middlewares/authMid.js";
import { openShortUrl, shortenUrl } from "../controllers/urls.controller.js";

const urlsRouter = Router();


urlsRouter.get("/urls/:id");
urlsRouter.get("/urls/open/:shortUrl", openShortUrl);
urlsRouter.delete("/urls/:id");
urlsRouter.post("/urls/shorten", validateSchema(urlSchema), shortenUrl);

export default urlsRouter;



