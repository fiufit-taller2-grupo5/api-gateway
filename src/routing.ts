import axios, { AxiosRequestConfig } from "axios";
import { Request, Response } from "express";
import { createNewUserInFirebase } from "./firebase/utils";
import multer, { Multer } from 'multer';

const timoutInMillis = 10000;

const getAxiosConfigFromRequest = (req: Request, serviceUrl: string): AxiosRequestConfig => {
    const headers = { ...req.headers };

    // Remove headers that shouldn't be forwarded
    delete headers['content-length'];
    delete headers['host'];
    delete headers['connection'];

    let data = req.body;
    if (req.file) {
        console.log("req.file.buffer len: ");
        console.log(req.file.buffer.length);

        const fileData = new Blob([req.file.buffer], { type: "image/*" })
        const formData = new FormData();
        formData.append('file', fileData, req.file.originalname);
        data = formData;
    }

    return {
        method: req.method,
        url: serviceUrl,
        headers: headers,
        data: data,
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
        if (req.file) {
            logMessage += ` with file ${req.file.originalname}`
        }
        if (req.headers && Object.keys(req.headers).length > 0) {
            logMessage += ` and headers ${JSON.stringify(req.headers)}`
        }
        console.log(logMessage);

        console.log("axiosConfig:");
        console.log(axiosConfig);
        const response = await axios(axiosConfig);
        console.log("response: ", response.status, response.data);
        console.log("response headers: ", response.headers);
        for (const key in response.headers) {
            res.setHeader(key, response.headers[key]);
        }

        res.send(response.data);
    } catch (err: any) {
        if (err.code == '404') {
            res.status(404).send('endpoint not found');
        } else if (err && err.response) {
            res.status(err.response.status).send(err.response.data);
        } else {
            res.status(500).send(err.message);
        }
    }
}

export const routeUserServiceRequest = async (req: Request, res: Response) => {
    // caso login desde app mobile
    if (req.headers['login-mobile-app']) {
        const userServiceUrl = `http://user-service${req.url.replace('/user-service', '')}`;
        return handleRequestByService(req, res, userServiceUrl);
    }

    if (req.headers["dev"] !== "true") {
        if ((req.path === '/user-service/api/admins' || (req.path === '/user-service/api/users' && req.headers["create-in-firebase"] === "true")) && req.method == 'POST' && req.headers['test'] !== 'true') {
            try {
                if (!req.body.email || !req.body.password || !req.body.name) {
                    return res.status(400).send({ status: "error", message: "name, email and password are required" });
                }
                await createNewUserInFirebase(req.body.email, req.body.password);
            } catch (err: any) {
                return res.status(500).send({ status: "error", message: err.message });
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
    return await handleRequestByService(req, res, traningServiceUrl);
};
