import { Request, Response, NextFunction } from 'express';

export const swaggerDocs = (req: Request, _res: Response, next: NextFunction) => {
    console.log("Received request with path: " + req.path + " and method: " + req.method);
    if (req.path.includes("user-service/swagger-ui") && req.method === "GET") {
        console.log("Modifying path to suite swagger-ui");
        req.path = req.path.replace("user-service/", "user-service/docs/");
        console.log("Not path is " + req.path);
    } else {
        console.log("Not a swagger request");
    }

    next();
}