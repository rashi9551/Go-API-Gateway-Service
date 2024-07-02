import { Request,Response } from "express"
import rideRabbitMqClient from './rabbitmq/client'
import { StatusCode } from "../../interfaces/enum"
import { Message, RidePayment} from "../../interfaces/interface";


export default class rideController{
    getCurrentRide=async(req:Request,res:Response)=>{
        try {
            console.log(req.query);
            const operation ='get-current-ride'
            const response = await rideRabbitMqClient.produce({...req.query},operation)
            console.log(response);
            res.status(StatusCode.Created).json(response)
        } catch (e) {
            console.log(e);

        }
    }
    getAllRides=async(req:Request,res:Response)=>{
        try {
            console.log(req.query,"==========");
            const operation ='get-all-ride'
            const response = await rideRabbitMqClient.produce({...req.query},operation)
            console.log(response);
            res.status(StatusCode.Created).json(response)
        } catch (e) {
            console.log(e);

        }
    }
    rideCompleteUpdate=async(data:RidePayment):Promise<Message>=>{
        try {
            const operation ='ride-complete-update'
            const response:Message = await rideRabbitMqClient.produce({rideId:data.rideId,paymentMode:data.paymentMode},operation) as Message
            console.log(response);
            return(response)
        } catch (e) {
            console.log(e);
            return { message: 'Failed to complete ride update' }; 
        }
    }
}