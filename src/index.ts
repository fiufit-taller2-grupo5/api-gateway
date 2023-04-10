import express, { Express, Request, Response } from 'express';
import axios, { AxiosRequestConfig } from "axios";
import { decodeFirebaseIdToken } from './auth-middleware';
import cors from "cors";
import morgan from "morgan";

const app: Express = express();

app.use(cors());
app.use(morgan("common"));
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
        timeout: 3000, // 3 secs
    };
}

const handleUserServiceRequest = async (req: Request, res: Response) => {
    const userServiceUrl = `http://user-service${req.url.replace('/user-service', '')}`;
    
    try {
        let axiosConfig = getAxiosConfigFromRequest(req, userServiceUrl);
        console.log(`Sending ${req.method} request to ${userServiceUrl}`);
        const response = await axios(axiosConfig);
        for (const key in response.headers) {
            res.setHeader(key, response.headers[key]);
        }
        
        res.send(response.data);
    } catch (err: any) {
        if (err.code == '404') {
            res.status(404).send('User-service endpoint not found');
        } else if (err && err.response) {
            res.status(err.response.status).send(err.response.data);
        } else {
            res.status(500).send(err.message);
        }
    }
};

app.all('/user-service/**', handleUserServiceRequest);


app.get("/training-service/**", async (req: Request, res: Response) => {
    const traningServiceUrl = `http://training-service${req.url.replace('/training-service', '')}`;
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