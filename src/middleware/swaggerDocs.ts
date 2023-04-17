import { Request, Response, NextFunction } from 'express';

export const swaggerDocs = (req: Request, _res: Response, next: NextFunction) => {
    console.log("Received request with path: " + req.path + " and method: " + req.method);
    if (req.originalUrl.includes("user-service/swagger-ui") && req.method === "GET") {
        console.log("Modifying path to suite swagger-ui");
        console.log("New path: " + req.originalUrl.replace("user-service/swagger-ui", "user-service/docs/swagger-ui"));
        req.url = req.originalUrl.replace("user-service/swagger-ui", "user-service/docs/swagger-ui");
        console.log("Now url is " + req.url);
    } else {
        console.log("Not a swagger request");
    }

    next();
}