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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

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
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
      }
}