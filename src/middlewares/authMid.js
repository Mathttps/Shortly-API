import { db } from "../database/db.connection.js";

export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await db.oneOrNone('SELECT * FROM sessions WHERE "userToken" = $1;', [token]);

    if (!session) {
      return res.sendStatus(401);
    }

    res.locals.session = session;
    next();
  } catch (err) {
    res.status(500).send(err.message);
  }
}
