import { Request,Response,NextFunction } from "express"
import adminRabbitMqClient from "../../driver/rabbitmq/client"
import { StatusCode } from '../../../interfaces/enum'
import { DriverInterface } from "../../../interfaces/mongo";
import { Message } from "../../../interfaces/interface";

export default class driverAdminController{
    pendingDrivers=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "admin-pending-drivers";
          const response: DriverInterface = await adminRabbitMqClient.produce(null, operation)as DriverInterface
          res.status(StatusCode.Created).json(response);
        } catch (e:any) {
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
          const response: DriverInterface = await adminRabbitMqClient.produce(null, operation)as DriverInterface
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
          const response: DriverInterface = await adminRabbitMqClient.produce(null, operation)as DriverInterface
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
          const response: DriverInterface = await adminRabbitMqClient.produce(req.query, operation)as DriverInterface
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
          const response: Message = await adminRabbitMqClient.produce(req.query, operation)as Message
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
          const response: Message = await adminRabbitMqClient.produce({...req.query,...req.body}, operation)as Message
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
          const response: Message = await adminRabbitMqClient.produce({...req.query,...req.body}, operation)as Message
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
      }
}