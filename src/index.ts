import express, { Express, Request, Response } from 'express';
import axios, { AxiosRequestConfig } from "axios";
import { decodeFirebaseIdToken } from './auth-middleware';

const app: Express = express();
app.use(decodeFirebaseIdToken);

const port = 8181;

app.get("/", (_req: Request, res: Response) => {
    console.log("Hello");
    res.send("Hello");
});

app.get("/health", (_req, res) => {
    res.send("Healthcheck OK");
});

const getAxiosConfigFromRequest = (req: Request, serviceUrl: string): AxiosRequestConfig => {
    return {
        method: req.method,
        url: serviceUrl,
        headers: req.headers,
        data: req.body,
    };
}

app.get('/user-service/**', async (req: Request, res: Response) => {
    const userServicePort = 3000;
    const userServiceUrl = `http://user-service:${userServicePort}${req.url.replace('/user-service', '')}`;
    try {
        const response = await axios(getAxiosConfigFromRequest(req, userServiceUrl));
        res.send(response.data);
    } catch (err: any) {
        if (err && err.response) {
            res.status(err.response.status).send(err.response.data);
        } else {
            res.status(500).send(err.message);
        }
    }
});

app.get("/training-service/**", async (req: Request, res: Response) => {
    const traningServicePort = 3000;
    const traningServiceUrl = `http://training-service:${traningServicePort}${req.url.replace('/training-service', '')}`;
    try {
        const response = await axios(getAxiosConfigFromRequest(req, traningServiceUrl));
        res.send(response.data);
    } catch (err: any) {
        if (err && err.response) {
            res.status(err.response.status).send(err.response.data);
        } else {
            res.status(500).send(err.message);
        }
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server :) is running at port ${port}`);
});