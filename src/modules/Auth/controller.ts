import { NextFunction, Request, Response } from "express";
import { AuthClient } from "./config/grpc-client/auth.client";
import AsyncHandler from "express-async-handler";
import { StatusCode } from "../../interfaces/enum";


declare global {
    namespace Express {
      interface Request {
        userId?: string;
        role?: string;
      }
    }
  }

export const isValidated = AsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.trim().split(" ")[1]; 
    console.log(token);
    AuthClient.IsAuthenticated({ token }, (err:any, result:any) => {
      if (err) {
        console.log(err);
        res.status(StatusCode.Unauthorized).json({ success: false, message: err });
      } else {
        next();
      }
    });
  }
);