import express,{Application} from 'express'
import upload from '../../middleware/multer'
import driverAuthController from './controllers/authController'
import driverControl from './controllers/driverController'
import { isValidated } from '../auth/controller'

const driverRoute:Application=express()
const AuthController= new driverAuthController()
const driverController= new driverControl()
driverRoute.post("/checkLoginDriver", AuthController.checkLogin);
driverRoute.post("/checkGoogleLoginDriver", AuthController.checkGoogleLoginDriver);
driverRoute.post("/registerDriver", AuthController.register);
driverRoute.post("/checkDriver", AuthController.checkDriver);
driverRoute.post("/location", AuthController.location);
driverRoute.post("/identification",upload.fields([{ name: "aadharImage", maxCount: 1 },{ name: "licenseImage", maxCount: 1 },]),AuthController.identificationUpdate);
driverRoute.post("/uploadDriverImage",upload.single("driverImage"),AuthController.updateDriverImage);
driverRoute.post("/vehicleDetails",upload.fields([{ name: "carImage", maxCount: 1 },{ name: "rcImage", maxCount: 1 },]),AuthController.vehicleUpdate);
driverRoute.get("/driverData",isValidated,driverController.getDriverData);
driverRoute.post("/profileUpdate", isValidated,driverController.profileUpdate);
driverRoute.get("/updateStatus", isValidated,driverController.updateStatus);



export default driverRoute