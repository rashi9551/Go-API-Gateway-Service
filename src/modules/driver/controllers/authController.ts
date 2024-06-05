import { Request,Response,NextFunction } from "express"
import driverRabbitMqClient from "../rabbitmq/client"
import { StatusCode } from '../../../interfaces/enum'
import  uploadToS3 from '../../../services/s3'
export default class driverAuthController{

    checkLogin=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
            const {mobile}=req.body
          const operation = "login-check";
          const response: any = await driverRabbitMqClient.produce({mobile}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
    checkGoogleLoginDriver=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
            const {email}=req.body
          const operation = "google-login";
          const response: any = await driverRabbitMqClient.produce({email}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }

      register=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "driver-register";
          const response: any = await driverRabbitMqClient.produce(req.body, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      checkDriver=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "driver-check";
          const response: any = await driverRabbitMqClient.produce(req.body, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      location=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const operation = "driver-location";
          const response: any = await driverRabbitMqClient.produce({...req.body,...req.query}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }

      identificationUpdate=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
            const files:any=req.files
            let aadharImageUrl=""
            let licenseImageUrl=""
            if(files){
                aadharImageUrl=await uploadToS3(files["aadharImage"][0])
                licenseImageUrl=await uploadToS3(files["licenseImage"][0])
                console.log(licenseImageUrl);
                console.log(aadharImageUrl);
                
            }
          const operation = "identification-update";
          const response: any = await driverRabbitMqClient.produce({...req.body,...req.query,aadharImageUrl,licenseImageUrl}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }
      updateDriverImage=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const files:Express.Multer.File | undefined =req.file
          let url=""
          if(files){
            url=await uploadToS3(files)
            console.log(url);
          }
          const operation = "driver-image-update";
          const response: any = await driverRabbitMqClient.produce({...req.query,url}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }

      vehicleUpdate=async(req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
            const files:any=req.files
            let rcImageUrl=""
            let carImageUrl=""
            if(files){
                rcImageUrl=await uploadToS3(files["rcImage"][0])
                carImageUrl=await uploadToS3(files["carImage"][0])
                console.log(carImageUrl,rcImageUrl);
                
            }
          const operation = "vehicle-image-update";
          const response: any = await driverRabbitMqClient.produce({...req.body,...req.query,rcImageUrl,carImageUrl}, operation);
    
          res.status(StatusCode.Created).json(response);
        } catch (e: any) {
          console.log(e);
        }
      }


}