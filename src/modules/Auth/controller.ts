import { NextFunction, Request, Response } from "express";
import { AuthClient } from './config/grpc-client/auth.client';
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
    try {
      
      const token = req.cookies?.token || req.headers.authorization?.trim().split(" ")[1]; 
      AuthClient.IsAuthenticated({ token }, (err:any, result:any) => {
        if (err) {
          console.log(err);
          res.status(StatusCode.Unauthorized).json({ success: false, message: err });
        } else {
          next();
        }
      });
    } catch (error) {
      console.log(error);

      
    }
  }
);

export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.refreshToken ||req.headers.authorization?.trim().split(" ")[1] || req.body.token;
    console.log("ithu refresh token .......",token);
    
    if (token) {
      AuthClient.RefreshToken({ token }, (err:any, result:any) => {
        if (err) {
          // console.log(err);
          res.status(StatusCode.NotAcceptable).json({ message: "Invalid refresh token" });
        } else {
          console.log(result,"ithu refresh------");
          res
            .status(StatusCode.Created)
            .json({ success: true,token:result?.accessToken ,refreshToken:result?.refreshToken ,message: "new token generated successfully" });
        }
      });
    } else {
      res.status(StatusCode.Unauthorized).json({message: "Token is missing"});
    }
    
  } catch (error) {
    console.log(error);
    
  }
};