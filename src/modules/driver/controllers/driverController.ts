import { Request,Response,NextFunction } from "express"
import driverRabbitMqClient from "../rabbitmq/client"
import { StatusCode } from '../../../interfaces/enum'
import  uploadToS3 from '../../../services/s3'
import { Message, rideData, RidePayment } from "../../../interfaces/interface"
import rideControll from "../../ride/controller"
import { monthNames } from "../../../utils/generatePIN"
import { DriverInterface } from "../../../interfaces/mongo"

const rideController=new rideControll()

export default class driverControl{
    getDriverData=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {            
          const operation = "driver-getData";
          const response: DriverInterface = await driverRabbitMqClient.produce({...req.query}, operation) as DriverInterface
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
          const response: DriverInterface = await driverRabbitMqClient.produce({...req.query,...req.body}, operation)as DriverInterface
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
          const response: DriverInterface = await driverRabbitMqClient.produce({...req.query}, operation) as DriverInterface
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
          const response: any = await driverRabbitMqClient.produce({...req.query,...req.body}, operation) as any
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
    report=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {        
          console.log({...req.query,...req.body},"resseyyy"); 
          const operation = "report-submit";
          const response: any = await driverRabbitMqClient.produce({...req.query,...req.body}, operation) as any
          if(response.message==="Success"){
            const response:any=await rideController.report({ ...req.query, ...req.body }) as unknown as Promise<Message>
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
          const response: Message = await driverRabbitMqClient.produce(data, operation) as Message
          return (response);
        } catch (e: any) {
          console.log(e);

        }
    }
    dashboardData=async() => {
        try {            
          const operation = "admin-get-dashboarData";
          const response: any = await driverRabbitMqClient.produce({}, operation);
          return (response);
        } catch (e: any) {
          console.log(e);

        }
    }
    redeemWallet=async(req: Request,
      res: Response,
      next: NextFunction
    )  => {
        try {            
          const operation = "redeem-driver-wallet-razorpay";
          const response: any = await driverRabbitMqClient.produce({...req.body,...req.query}, operation);
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
          return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    }
    driverDashboardData=async(req: Request,
      res: Response,
      next: NextFunction
    ) => {
        try {   
          const data:{driver_id:string}={...req.query} as {driver_id:string}               
          const operation = "driver-getData";
          const driverData: DriverInterface = await driverRabbitMqClient.produce({...req.query}, operation) as DriverInterface
          const ride:rideData=await rideController.driverDashboardData(data) as rideData
          console.log(ride.data);
          const chartData = ride.data.map((item) => ({
            name: monthNames[item.month - 1],
            Earnings: item.totalAmount,
          }));
          res.status(StatusCode.Created).json({ chartData, pieChartData:ride.pieChartData, driverData, CurrentMonthRides: ride.count[0]?.totalCount });          
        } catch (e: any) {
          console.log(e);
        }
    }
}