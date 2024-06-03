import {Response,Request} from 'express'
import { UserService } from './config/grpc-client/user.client'
import { StatusCode } from '../../interfaces/enum'

export default class userController{
    
    register=(req:Request,res:Response)=>{
        const userImage=req.file
        const token = req.cookies.otp
        console.log(token,"register nnu ponnathu");
        UserService.Register({ ...req.body,
            userImage,
            token,
       
            },(err:any,result:any)=>{
            if(err){
                res.status(StatusCode.BadRequest).json({message:err})
            }else{
                console.log("result ",result);
                res.status(StatusCode.Created).json(result)
            }
        })
    }
    checkUser=(req:Request,res:Response)=>{       
        UserService.CheckUser(req.body,(err:any,result:any)=>{
            if(err){
                console.log(err);
                res.status(StatusCode.BadRequest).json({message:err})
            }else{
                console.log("result ",result);
                res.cookie("otp", result.token, {
                httpOnly: true,
                expires: new Date(Date.now() + 180000),
                sameSite: "none",
                secure: true,
                });
                res.status(StatusCode.Created).json(result)
            }
        })
    }
    resendOtp=(req:Request,res:Response)=>{
        console.log(req.body);
        UserService.ResendOtp(req.body,(err:any,result:any)=>{
            if(err){
                res.status(StatusCode.BadRequest).json({message:err})
            }else{
                console.log("result ",result);
                res.cookie("otp", result.token, {
                    httpOnly: true,
                    expires: new Date(Date.now() + 180000),
                    sameSite: "none",
                    secure: true,
                    });
                res.status(StatusCode.Created).json(result)
            }
        })
    }
    checkGoogleLoginUser=(req:Request,res:Response)=>{
        console.log(req.body);
        UserService.CheckGoogleLoginUser(req.body,(err:any,result:any)=>{
            if(err){
                res.status(StatusCode.BadRequest).json({message:err})
            }else{
                console.log("result ",result);
                res.status(StatusCode.Created).json(result)
            }
        })
    }
    checkLoginUser=(req:Request,res:Response)=>{
        console.log(req.body);
        UserService.CheckLoginUser(req.body,(err:any,result:any)=>{
            if(err){
                res.status(StatusCode.BadRequest).json({message:err})
            }else{
                console.log("result ",result);
                res.status(StatusCode.Created).json(result)
            }
        })
    }
    getUser=(req:Request,res:Response)=>{
        try {
            
            console.log(req.query);
            UserService.GetUser(req.query,(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    profileUpdate=(req:Request,res:Response)=>{
        try {
            
            const {user_id}=req.query
            const id=user_id
            console.log(id);
            
            UserService.ProfileUpdate({id,...req.body},(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }


    
}