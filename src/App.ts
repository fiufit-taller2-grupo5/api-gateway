import { Express } from 'express';
import cors from "cors";
import morgan from "morgan";
import { firebaseAuth } from './middleware/firebaseAuth';
import { AppRouter } from './AppRouter';
import * as express from 'express';
import { swaggerDocs } from './middleware/swaggerDocs';

export class App {
    private app: Express;
    private port: number;
    private router: AppRouter;

    constructor(app: Express, port: number, router: AppRouter) {
        this.app = app;
        this.port = port;
        this.router = router;
        this.initMiddleware();
        this.router.initRoutes();
    }

    public startListening() {
        this.app.listen(this.port, () => {
            console.log(`⚡️ Api Gateway is running at port ${this.port}`);
        });
    }

    private initMiddleware() {
        this.app.use(cors());
        this.app.use(morgan("common"));
        this.app.use(express.json());
        this.app.use(swaggerDocs);
        this.app.use(firebaseAuth);
    }
}