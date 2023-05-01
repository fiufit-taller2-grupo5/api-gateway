import { Request, Response, NextFunction } from 'express';

export const swaggerDocs = (req: Request, _res: Response, next: NextFunction) => {
    if (req.originalUrl.includes("user-service/swagger-ui") && req.method === "GET") {
        req.url = req.originalUrl.replace("user-service/swagger-ui", "user-service/docs/swagger-ui");
    } else if (req.originalUrl.includes("openapi.json") && req.method == "GET") {
        console.log("Req includes /openapi.json");
        if(req.headers["referer"] && req.headers["referer"]?.includes("training-service/docs")) {
            console.log("Redirecting correctly to training-service docs");
            req.url = req.originalUrl.replace("openapi.json", "training-service/openapi.json");
        } else {
            console.log("Not redirecting");
        }
    }

    next();
}