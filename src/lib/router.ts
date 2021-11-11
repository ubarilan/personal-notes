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

    router.get('*', (req: Request, res: Response) => {
        res.send(`<form action="/authenticate" method="POST">
        <input name="key">
        <input type="submit">
    </form>`);
    });
}
