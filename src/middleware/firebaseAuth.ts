import firebase from '../firebase/admin-config';
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosRequestConfig } from "axios";

const continueWithUserEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization as string;
    const idToken: string = authHeader.split('Bearer ')[1];
    console.log("Bearer token is: ", idToken);
    console.log("entire request headers are:", req.headers);
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    console.log("incoming request from user:", decodedToken.email);
    req.headers["X-Email"] = decodedToken.email;
    next();
  } catch (error) {
    console.log("Error while decoding id token", error);
    return res.status(401).json({
      error,
    });
  }
}

export const addUserRoleToTheRequestHeaderMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userEmail = req.headers["X-Email"] as string;
  if (userEmail) {
    try {
      const user = await axios('http://user-service:80/api/users/by_email/' + userEmail);
      if (user.data.state === "blocked") {
        console.log("User making request is blocked!");
        return res.status(403).json({ message: "you do not have access to the system" });
      }
      console.log("User role is", user.data.role);
      req.headers["X-Role"] = user.data.role;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log("Error while getting user by email", error);
        return res.status(error.response.status).json({
          ...error.response.data,
        });
      } else {
        console.log("Error while getting user by email", error);
        return res.status(500).json({
          error,
        });
      }
    }
  }
  next();
}

export const firebaseAuth = async (req: Request, res: Response, next: NextFunction) => {


  if (req.headers['login-mobile-app'] || req.headers['password-reset']) {
    return next();
  }

  const headers = req.headers;
  if (headers["dev-email"]) {
    console.log("User in dev mode");
    req.headers["X-Email"] = headers["dev-email"] as string;
    return next();
  }

  if (headers.dev) {
    console.log("User in dev mode");
    return next();
  }

  if (!req.headers.authorization) {
    console.log("User not authenticated");
    return res.status(401).json({
      error: {
        message: 'You did not specify any idToken for this request',
      },
    });
  }

  return await continueWithUserEmail(req, res, next);
};
