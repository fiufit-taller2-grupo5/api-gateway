import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import { createNewAdminInFirebase } from "./firebase/utils";


const timoutInMillis = 3000;

const getAxiosConfigFromRequest = (req: Request, serviceUrl: string): AxiosRequestConfig => {
    const headers = { ...req.headers };

    // Remove headers that shouldn't be forwarded
    delete headers['content-length'];
    delete headers['host'];
    delete headers['connection'];

    return {
        method: req.method,
        url: serviceUrl,
        headers: headers,
        data: req.body,
        timeout: timoutInMillis,
    };
};

const handleRequestByService = async (req: Request, res: Response, serviceUrl: string) => {
    try {
        let axiosConfig = getAxiosConfigFromRequest(req, serviceUrl);
        let logMessage = `Sending ${req.method} request to ${serviceUrl}`;
        if (req.body && req.body.length > 0) {
            logMessage += ` with body ${JSON.stringify(req.body)}`
        }
        console.log(logMessage);

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
}

export const routeUserServiceRequest = async (req: Request, res: Response) => {
    if (req.path == '/user-service/api/admins' && req.method == 'POST') {
        if (req.headers['test'] !== 'true') {
            try {
                await createNewAdminInFirebase(req.body.email, req.body.password);
            } catch (err: any) {
                return res.status(500).send(err.message);
            }
        }
    }

    const userServiceUrl = `http://user-service${req.url.replace('/user-service', '')}`;
    return handleRequestByService(req, res, userServiceUrl);
};

export const routeTrainingServiceRequest = async (req: Request, res: Response) => {
    console.log(`Got request directed to training-service (${req.url})`)
    const traningServiceUrl = `http://training-service${req.url.replace('/training-service', '')}`;
    console.log("Will redirect request to " + traningServiceUrl);
    return handleRequestByService(req, res, traningServiceUrl);
};
