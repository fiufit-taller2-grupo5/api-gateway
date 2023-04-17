import { Request, Response, NextFunction } from 'express';

export const swaggerDocs = (req: Request, _res: Response, next: NextFunction) => {
    if (req.originalUrl.includes("user-service/swagger-ui") && req.method === "GET") {
        req.url = req.originalUrl.replace("user-service/swagger-ui", "user-service/docs/swagger-ui");
    }

    next();
}