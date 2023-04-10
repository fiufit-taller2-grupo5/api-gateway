import { Express, Request, Response } from "express";
import { routeTrainingServiceRequest, routeUserServiceRequest } from "./routing";

export class AppRouter {

    private app: Express;

    constructor(app: Express) {
        this.app = app;
    }

    public initRoutes() {
        this.initHealthRoutes();
        this.initServicesRoutes();
    }

    private initHealthRoutes() {
        this.app.get("/", (_req: Request, res: Response) => {
            console.log("Hello");
            res.send("Hello");
        });

        this.app.get("/health", (_req, res) => {
            res.send("Healthcheck OK");
        });
    }

    private initServicesRoutes() {
        this.app.all('/user-service/**', routeUserServiceRequest);
        this.app.all("/training-service/**", routeTrainingServiceRequest);
    }
}