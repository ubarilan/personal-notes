import PersonalNotes from '../PersonalNotes';
import { Router, Request, Response } from 'express';

export function initMainRouter(this: PersonalNotes) {
    this.mainRouter = Router();
    const router: Router = this.mainRouter;

    router.post('/authenticate', (req: Request, res: Response) => {
        if (req.body.key === this.accessKey) {
            req.session.sessionExpiry = Date.now() + 1000 * 60 * 60; // 1 Hour access grant

            res.json({ status: 'success' });
        } else {
            res.status(401).redirect('/');
        }
    });

    router.get('/checkauth', (req: Request, res: Response) => {
        if (this.checkAuth(req)) {
            res.send({ status: 'authenticated' });
        } else {
            res.status(401).send({ status: 'unauthenticated' });
        }
    });

    router.get('/notes', (req: Request, res: Response) => {
        const sql: string = 'SELECT * FROM notes;';
        this.mysqlConnection.query(sql, (err, results) => {
            if (err) throw err;
            res.send(results);
        });
    });

    router.get('/notes/create', (req, res) => {
        const sql: string =
            'INSERT INTO notes(note, date_created) VALUES(?, ?)';

        this.mysqlConnection.query(
            sql,
            [req.query.note, Date.now()],
            (err, results) => {
                if (err) {
                    res.status(500).send({ status: 'error' });
                    throw err;
                } else res.send({ status: 'success' });
            }
        );
    });

    router.get('/notes/delete/:id', (req, res) => {
        if (isNaN(Number(req.params.id))) {
            return res.status(400).send({ status: 'bad data type' });
        } else {
            const sql: string = 'DELETE FROM notes WHERE id = ?';
            this.mysqlConnection.query(
                sql,
                Number(req.params.id),
                (err, results) => {
                    if (err || results.affectedRows === 0) {
                        res.status(404).send({
                            status: 'no such note',
                        });
                        throw err;
                    } else res.send({ status: 'success' });
                }
            );
        }
    });

    router.get('*', (req: Request, res: Response) => {
        res.send(`<form action="/authenticate" method="POST">
        <input name="key">
        <input type="submit">
        </form>`);
    });
}
