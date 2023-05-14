import firebase from '../firebase/admin-config';
import { Request, Response, NextFunction } from 'express';

const continueWithUserEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization as string;
    const idToken: string = authHeader.split('Bearer ')[1];
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    console.log("incoming request from user:", decodedToken.email);
    req.headers["X-Email"] = decodedToken.email;
    next();
  } catch (error) {
    console.log("Error while decoding id token", error);
    return res.status(500).json({
      error,
    });
  }
}

export const firebaseAuth = async (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers;
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
