import { Request,Response,NextFunction } from "express"
import driverRabbitMqClient from "../rabbitmq/client"
import { StatusCode } from '../../../interfaces/enum'
import  uploadToS3 from '../../../services/s3'
import { Message, RidePayment } from "../../../interfaces/interface"
import rideControll from "../../ride/controller"

const rideController=new rideControll()

export default class driverControl{
    getDriverData=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {            
          const operation = "driver-getData";
          console.log("vannu",req.query);
          const response: any = await driverRabbitMqClient.produce({...req.query}, operation);
          console.log(response,"ithu driver data");
          
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    profileUpdate=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {            
          const operation = "profile-update";
          const response: any = await driverRabbitMqClient.produce({...req.query,...req.body}, operation);
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    updateStatus=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {            
          const operation = "update-status";
          const response: any = await driverRabbitMqClient.produce({...req.query}, operation);
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    feedback=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {            
          const operation = "feedback-submit";
          const response: any = await driverRabbitMqClient.produce({...req.query,...req.body}, operation);
          if(response.message==="Success"){
            const response:any=await rideController.feedback({ ...req.query, ...req.body }) as unknown as Promise<Message>
            console.log(response,"ithu ride response");
            if(response.message==="Success"){
              res.status(StatusCode.Created).json(response);
            }else{
              return res.status(StatusCode.BadRequest).json({ message: 'feedback ride update failed' });

            }
          }else{
            return res.status(StatusCode.BadRequest).json({ message: 'feedback driver update failed' });

          }
        } catch (e: any) {
          console.log(e);
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    rideCompleteUpdate=async(data:RidePayment) => {
        try {            
          const operation = "driver-ride-complete-update";
          const response: any = await driverRabbitMqClient.produce(data, operation);
          return (response);
        } catch (e: any) {
          console.log(e);
          
        }
    }
    
}