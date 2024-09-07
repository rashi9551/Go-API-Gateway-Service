import {Response,Request, response} from 'express'
import { UserService } from './config/grpc-client/user.client'
import { StatusCode } from '../../interfaces/enum'
import uploadToS3 from '../../services/s3'
import Stripe from "stripe";
import rideControl from '../ride/controller';
import driverControl from '../driver/controllers/driverController';
import { AuthResponse, Message, RideInterface, RidePayment, UserInterface } from '../../interfaces/interface';

const rideController=new rideControl()
const driverController=new driverControl()

export default class userController{
    
    register=async(req:Request,res:Response)=>{
        try {
            console.log(req.body,"=-=-=-=-");
            const files:Express.Multer.File | undefined =req.file
            let userImage=""
            if(files){
            userImage=await uploadToS3(files)
            }
            const token = req.cookies.otp
            UserService.Register({ ...req.body,userImage,token,},(err:any,result:Message)=>{
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
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' }); 
        }
    }

    checkUser=(req:Request,res:Response)=>{    
        try {
            UserService.CheckUser(req.body,(err:any,result:{token:string,message:string})=>{
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
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }   
    }

    testerLogin=(req:Request,res:Response)=>{    
        try {
            console.log(req.body);
            
            UserService.testerLogin(req.body,(err:any,result:Message)=>{
                if(err){
                    console.log(err);
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log(result);
                    
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }   
    }

    resendOtp=(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            UserService.ResendOtp(req.body,(err:any,result:{token:string,message:string})=>{
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
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }

    checkGoogleLoginUser=(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            UserService.CheckGoogleLoginUser(req.body,(err:any,result:AuthResponse)=>{
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
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    checkLoginUser=(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            UserService.CheckLoginUser(req.body,(err:any,result:AuthResponse)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    verifyOtp=(req:Request,res:Response)=>{
        try {
            console.log(req.body);
            UserService.verifyOtp(req.body,(err:any,result:AuthResponse)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }

    getUser=(req:Request,res:Response)=>{
        try {
            console.log("its coming");
            UserService.GetUser(req.query,(err:any,result:{newData:UserInterface})=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result?.newData);
                    res.status(StatusCode.Created).json(result.newData)
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }

    profileUpdate=(req:Request,res:Response)=>{
        try {
            const {user_id}=req.query
            const id=user_id
            console.log(id);
            UserService.ProfileUpdate({id,...req.body},(err:any,result:{newData:UserInterface})=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result vanney ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    addWalletBalance=async(req:Request,res:Response)=>{
        try {
            const { sessionId } = req.body;
            console.log(req.body,"ithu body 0---0=-=-=-=-=-0-0-0=0-90-")
            const stripe = new Stripe(process?.env.STRIPE_SECRET_KEY as string, {
                apiVersion: "2024-06-20",
            });
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            console.log(session);
            if (session.payment_status ===StatusCode.payment_status) {
            UserService.addWalletBalance({...req.body},(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result vanney ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
        } else {
            res.status(200).json({ paymentStatus: 'failed' });
            return
            }
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    stripePayment=async(req:Request,res:Response)=>{
        try {
            const amount=req.body.amount
            const {success_url}=req.body
            console.log("payment stripe",req.body, amount);
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
                          unit_amount: amount*100,
                      },
                      quantity: 1,
                  },
              ],
              mode: "payment",
              success_url: `${success_url}`,
              cancel_url: "http://localhost:5173/account",
          });
            if(session){
                res.status(StatusCode.Created).json({id:session.id})
            }
          } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    RidePayment=async(req:Request,res:Response)=>{
        try {
            console.log(req.body, req.query, "=-=-=----=-=-=-=-=-=-=--=-=-=-");
            const ridePayment = (data: RidePayment):Promise<Message> =>
                new Promise((resolve, reject) => {
                    UserService.RidePayment(data, (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                    });
            });
            const data:RidePayment = { ...req.body, ...req.query };
            const result: Message = await ridePayment(data);
            console.log(result,"ithu status ----=-=-=-==");
            if (result.message === 'Success') {
                console.log(result.message,"user side");
                const rideResponse:Message = await rideController.rideCompleteUpdate(data) as Message
                if (rideResponse.message === 'Success') {

                    console.log(rideResponse.message,"ride side");

                    const driverResponse:Message = await driverController.rideCompleteUpdate(data) as Message
                    
                    if (driverResponse.message === 'Success') {
                        console.log(driverResponse.message,"driverResponse side");

                    return res.status(StatusCode.Created).json(result);
                    } else {
                    return res.status(StatusCode.BadRequest).json({ message: 'Driver update failed' });
                    }
                } else {
                    return res.status(StatusCode.BadRequest).json({ message: 'Ride update failed' });
                }
            } else {
            return res.status(StatusCode.BadRequest).json({ message: result.message });
            }
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    razorpayPayment = async (req: Request, res: Response) => {
        try {
            console.log(req.body, req.query, "=-=-=----=-=-=-=-=-=-=--=-=-=-");
            const ride_id:string=req.query.ride_id as string
            const ride:RideInterface=await rideController.getCurrentRideCheck({rideId:ride_id}) as RideInterface
            if(ride.status!="Completed"){
                UserService.razorpayPayment({...req.body, ...req.query},(err:any,result:RidePayment)=>{
                    if(err){
                        res.status(StatusCode.BadRequest).json({message:err})
                    }else{
                        console.log("result vanney ",result);
                        res.status(StatusCode.Created).json(result)
                    }
                })
            }else{
                res.status(StatusCode.Created).json({message:"Payment Completed"})

            }
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };  
}