import firebase from '../firebase/admin-config';
import { Request, Response, NextFunction } from 'express';

interface UserPayload {
  // Define userPayload properties here
}

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const firebaseAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

  try {
    const authHeader = req.headers.authorization as string;
    const idToken: string = authHeader.split('Bearer ')[1];
    const userPayload: UserPayload = await firebase.auth().verifyIdToken(idToken);
    req.user = userPayload;
    next();
  } catch (error) {
    console.log("Error while decoding id token", error);
    return res.status(500).json({
      error,
    });
  }
};
