import { db } from "../database/db.connection.js";
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
    try {
        const { url } = req.body;
        const { userId } = res.locals.session.rows[0];
        const shortenedUrl = nanoid(8);

        await db.query(
            `INSERT INTO urls ("userId", "shortUrl", "url") VALUES ($1, $2, $3);`,
            [userId, shortenedUrl, url]
        );

        const urlInfos = await db.query(
            `SELECT id, shortUrl FROM urls WHERE "shortUrl"=$1;`,
            [shortenedUrl]
        );

        const body = {
            id: urlInfos.rows[0].id,
            shortUrl: urlInfos.rows[0].shortUrl
        };

        res.status(201).send(body);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function openShortUrl(req, res) {
    try {
        const { shortUrl } = req.params;
        const shortUrlExist = await db.query(
            `SELECT id, visitCount, url FROM urls WHERE "shortUrl"=$1;`,
            [shortUrl]
        );

        if (shortUrlExist.rowCount === 0) {
            return res.sendStatus(404);
        }

        const { id, visitCount, url } = shortUrlExist.rows[0];
        const newVisitCount = visitCount + 1;

        await db.query(`UPDATE urls SET "visitCount"=$1 WHERE "id"=$2;`, [newVisitCount, id]);
        res.redirect(url);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
