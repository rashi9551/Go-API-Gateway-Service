import { Request,Response } from "express"
import rideRabbitMqClient from './rabbitmq/client'
import { StatusCode } from "../../interfaces/enum"


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
}