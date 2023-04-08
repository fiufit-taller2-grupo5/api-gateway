import express, { Express, Request, Response } from 'express';
import axios from "axios";

const app: Express = express();

const port = 3030;
app.get("/", (req: Request, res: Response) => {
    console.log("Hello");
    res.send("Hello");
});

app.get('/user-service/**', async (req: Request, res: Response) => {
    const userServicePort = 30000;
    const userServiceUrl = `http://user-service:${userServicePort}${req.url.replace('/user-service', '')}`;

    try {
        const config = {
            method: req.method,
            url: userServiceUrl,
            headers: req.headers,
            data: req.body,
        };

        console.log(config);

        const response = await axios(config);
        res.send(response.data);
    } catch(err: any) {
        res.status(err.response.status).send(err.response.data);
    }
    
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server :) is running at http://localhost:${port}`);
});