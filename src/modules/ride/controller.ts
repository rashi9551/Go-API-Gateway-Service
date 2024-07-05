import { Request,Response } from "express"
import rideRabbitMqClient from './rabbitmq/client'
import { StatusCode } from "../../interfaces/enum"
import { Message, RidePayment, feedback} from "../../interfaces/interface";
import { RideDetails } from "../../interfaces/mongo";


export default class rideController{
    getCurrentRide=async(req:Request,res:Response)=>{
        try {
            console.log("get current id -=======-=-=-=-=-=-=-=-=-=-");
            const operation ='get-current-ride'
            const response = await rideRabbitMqClient.produce({...req.query},operation)
            console.log(response);
            res.status(StatusCode.Created).json(response)
        } catch (e) {
            console.log(e);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    getAllRides=async(req:Request,res:Response)=>{
        try {
            console.log("get all ride id==========",req.query);
            const operation ='get-all-ride'
            const response = await rideRabbitMqClient.produce({...req.query},operation)
            console.log(response);
            res.status(StatusCode.Created).json(response)
        } catch (e) {
            console.log(e);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    
    rideCompleteUpdate=async(data:RidePayment):Promise<Message>=>{
        try {
            console.log("rid ecomplete -=======-=-=-=-=-=-=-=-=-=-");
            const operation ='ride-complete-update'
            const response:Message = await rideRabbitMqClient.produce({rideId:data.rideId,paymentMode:data.paymentMode},operation) as Message
            console.log(response);
            return(response)
        } catch (e) {
            console.log(e);
            return { message: 'Failed to complete ride update' }; 
        }
    }

    feedback = (data: feedback): Promise<Message> |string => {
        try {
            return new Promise<Message>(async (resolve, reject) => {
                try {
                const operation = 'update-feedback'; 
                const response:Message = await rideRabbitMqClient.produce(data, operation) as Message
                console.log(response);
                resolve(response); 
                } catch (e) {
                console.error(e);
                reject({ message: 'Failed to complete ride update' }); 
                }
            });
        } catch (error) {
            console.log(error);
            return ""
            
        }
    };
    dashboardData = () => {
        return new Promise((resolve, reject) => {
            const operation = 'get-dashboardData';
            rideRabbitMqClient.produce({}, operation)
                .then(response => {
                    console.log(response);
                    resolve(response);
                })
                .catch(error => {
                    console.error(error);
                    reject({ message: 'Failed to complete ride update' });
                });
        });
    }

}