import { db } from "../database/db.connection.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const handleServerError = (res, err) => {
    console.error(err);
    res.status(500).send(err.message);
};

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    try {
        const emailExist = await db.query('SELECT * FROM users WHERE email=$1;', [email]);
        if (emailExist.rowCount > 0) return res.sendStatus(409);

        const hash = await bcrypt.hash(password, 10);

        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3);', [name, email, hash]);
        res.sendStatus(201);
    } catch (err) {
        handleServerError(res, err);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const userExist = await db.query('SELECT * FROM users WHERE email=$1;', [email]);
        if (userExist.rowCount === 0 || !bcrypt.compareSync(password, userExist.rows[0].password)) {
            return res.sendStatus(401);
        }

        const token = uuid();
        const userId = userExist.rows[0].id;

        await db.query('INSERT INTO sessions ("userId", "userToken") VALUES ($1, $2);', [userId, token]);
        res.json({ token });
    } catch (err) {
        handleServerError(res, err);
    }
}

// export async function getUrlsByUser(req, res) {
//     try {
//         const userId = res.locals.session.rows[0].userId;

//         const data = await db.query(`
//             SELECT users.id as "userId", users.name, urls.id as "urlId", urls."shortUrl", urls.url, urls."visitCount"
//             FROM users
//             JOIN urls ON users.id = urls."userId"
//             WHERE users.id=$1
//         `, [userId]);

//         const { name, userId: id, rows } = data;

//         const totalVisitCount = rows.reduce((acc, row) => acc + row.visitCount, 0);
//         const shortenedUrls = rows.map(row => ({
//             id: row.urlId,
//             shortUrl: row.shortUrl,
//             url: row.url,
//             visitCount: row.visitCount
//         }));

//         const responseObj = { id, name, visitCount: totalVisitCount, shortenedUrls };

//         res.json(responseObj);
//     } catch (err) {
//         handleServerError(res, err);
//     }
// }


