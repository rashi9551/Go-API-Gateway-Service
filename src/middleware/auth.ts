import jwt, { JwtPayload } from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
import { ObjectId } from 'mongodb'

interface DecodedToken{
    id:string,
    role:string
}

export default {
    createToken:async(clientId:ObjectId | string)=>{
        const jwtSeceretKey:string | undefined=process.env.USER_SECRET_KEY  || "Rashid"
        const token=await jwt.sign({clientId},jwtSeceretKey)
        return token

    },
     verifyOtpToken :(token: string) => {
        const secretKey = process.env.USER_SECRET_KEY || "Rashid";
        console.log(token);
        
        try {
            const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
            console.log(decodedToken,"decode");
            
            return decodedToken
        } catch (error:any) {
          console.error('Token verification failed:', error.message);
          return ({message:"inavlid otp"});
        }
      },
    verifyToken:async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const token = req.headers.authorization?.trim().split(" ")[1];
                
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        } else {
            try {
                const jwtSecretKey =process.env.USER_SECRET_KEY  || "Rashid"
                const decodedToken = jwt.verify(token, jwtSecretKey) as JwtPayload;
                // req.clientId = decodedToken.clientId;
                next();
            } catch (error) {
                res.status(500).json({ message: (error as Error).message });
            }
        }
        } catch (error) {
            console.log(error);
            
        }
    }
}
