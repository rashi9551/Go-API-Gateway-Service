import { Request,Response,NextFunction } from "express"
import adminRabbitMqClient from "../../driver/rabbitmq/client"
import { StatusCode } from '../../../interfaces/enum'

export default class driverAdminController{
    pendingDrivers=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-pending-drivers";
          const response: any = await adminRabbitMqClient.produce(null, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      verifiedDrivers=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-verified-drivers";
          const response: any = await adminRabbitMqClient.produce(null, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      blockedDrivers=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-blocked-drivers";
          const response: any = await adminRabbitMqClient.produce(null, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      driverData=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-get-driver-data";
          const response: any = await adminRabbitMqClient.produce(req.query, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      verifyDriver=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-verify-driver";
          const response: any = await adminRabbitMqClient.produce(req.query, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      rejectDriver=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-reject-driver";
          const response: any = await adminRabbitMqClient.produce({...req.query,...req.body}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      updateDriverStatus=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-update-status-driver";
          const response: any = await adminRabbitMqClient.produce({...req.query,...req.body}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
}