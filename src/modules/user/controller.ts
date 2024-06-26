import {Response,Request} from 'express'
import { UserService } from './config/grpc-client/user.client'
import { StatusCode } from '../../interfaces/enum'
import uploadToS3 from '../../services/s3'
import Stripe from "stripe";

export default class userController{
    
    register=async(req:Request,res:Response)=>{
        try {
            const files:Express.Multer.File | undefined =req.file
              let userImage=""
              if(files){
                userImage=await uploadToS3(files)
                console.log(userImage);
              }
            const token = req.cookies.otp
            UserService.Register({ ...req.body,
                userImage,
                token,
                },(err:any,result:any)=>{
                if(err){
                    console.log(err);
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
    checkUser=(req:Request,res:Response)=>{    
        try {
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
            
        } catch (error) {
            console.log(error);
            
        }   
    }
    resendOtp=(req:Request,res:Response)=>{
        try {
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
            
        } catch (error) {
            console.log(error);
            
        }
    }
    checkGoogleLoginUser=(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            UserService.CheckGoogleLoginUser(req.body,(err:any,result:any)=>{
                if(err){
                    console.log(err);
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
    checkLoginUser=(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            UserService.CheckLoginUser(req.body,(err:any,result:any)=>{
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
    getUser=(req:Request,res:Response)=>{
        try {
            
        } catch (error) {
            console.log(error);
            
        }
        try {
            console.log("its coming");
            UserService.GetUser(req.query,(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result?.newData);
                    res.status(StatusCode.Created).json(result.newData)
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
                    console.log("result vanney ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    addWalletBalance=(req:Request,res:Response)=>{
        try {
            const id=req.query.user_id
            UserService.addWalletBalance({...req.body},(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result vanney ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    payment=async(req:Request,res:Response)=>{
        try {
            const {balance}=req.body
            const stripe = new Stripe(process?.env.STRIPE_SECRET_KEY as string, {
              apiVersion: "2024-06-20",
          });
          
      
          const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              line_items: [
                  {
                      price_data: {
                          currency: "inr",
                          product_data: {
                              name: "Wallet recharge",
                          },
                          unit_amount: Number(balance) * 100,
                      },
                      quantity: 1,
                  },
              ],
              mode: "payment",
              success_url: `http://localhost:5173/account}`,
              cancel_url: "http://localhost:5173/account",
          });
          
          
            if(session){
                res.status(StatusCode.Created).json({id:session.id})
            }
            
          } catch (error) {
            console.log(error);
            return { error: (error as Error).message };
          }
    }


    
}