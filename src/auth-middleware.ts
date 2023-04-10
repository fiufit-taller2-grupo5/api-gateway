import firebase from './admin-config';
import { Request, Response, NextFunction } from 'express';

interface UserPayload {
  // Define userPayload properties here
}

const roleRanks = {
  superAdmin: 1,
  admin: 2,
  user: 3,
};

interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export const decodeFirebaseIdToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const headers = req.headers;
  if (headers.dev) {
    console.log("User in dev mode");
    return next();
  }

  if (!req.headers.authorization && !req.headers.id_token) {
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
    console.log("User validated");
    next();
  } catch (error) {
    console.log("Error while decoding id token", error);
    return res.status(500).json({
      error,
    });
  }
};
