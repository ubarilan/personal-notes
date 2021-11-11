import express, { Application, Request, Response, Router } from 'express';
import session from 'express-session';
import { config } from 'dotenv';

import { initMainRouter } from './lib/router';

config();

export default class PersonalNotes {
    protected webApp: Application;
    protected mainRouter: Router;

    protected authenticatedSessions: Map<string, number> = new Map();

    private initMainRouter: () => void = initMainRouter;

    constructor(protected accessKey: string) {
        this.webApp = express();
        this.initRouters();
        this.initWebApp();
    }

    private initRouters(): void {
        this.initMainRouter();
    }

    private initWebApp() {
        this.webApp.set('view engine', 'ejs');
        this.webApp.use(express.json());
        this.webApp.use(express.urlencoded({ extended: true }));

        this.webApp.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
            })
        );

        this.webApp.use('/', this.mainRouter);

        this.webApp.listen(80);
        console.log('web server running on port 80');
    }
}
