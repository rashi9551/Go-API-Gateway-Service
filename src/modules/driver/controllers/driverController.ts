import { Request,Response,NextFunction } from "express"
import driverRabbitMqClient from "../rabbitmq/client"
import { StatusCode } from '../../../interfaces/enum'
import  uploadToS3 from '../../../services/s3'
import { RidePayment } from "../../../interfaces/interface"

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