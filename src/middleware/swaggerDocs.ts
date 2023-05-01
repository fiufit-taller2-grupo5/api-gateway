import { Request, Response, NextFunction } from 'express';

const redirectToUserServiceDocsIfNecessary = (req: Request) => {
    if (req.originalUrl.includes("user-service/swagger-ui") && req.method === "GET") {
        req.url = req.originalUrl.replace("user-service/swagger-ui", "user-service/docs/swagger-ui");
    }
}

const redirectToTrainingServiceDocsIsNecessary = (req: Request) => {
    if (req.originalUrl.includes("openapi.json") && req.method == "GET") {
        if(req.headers["referer"] && req.headers["referer"]?.includes("training-service/docs")) {
            req.url = req.originalUrl.replace("openapi.json", "training-service/openapi.json");
        }
    }
}

export const swaggerDocs = (req: Request, _res: Response, next: NextFunction) => {
    if (req.headers["referer"] && req.headers["referer"]?.includes("/docs")) {
        req.headers["dev"] = "dev";
    }


    redirectToUserServiceDocsIfNecessary(req);
    redirectToTrainingServiceDocsIsNecessary(req);
    next();
}
