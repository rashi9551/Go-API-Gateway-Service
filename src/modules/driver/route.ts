import express,{Application} from 'express'
import upload from '../../middleware/multer'
import auth from '../../middleware/auth'
import driverAuthController from './controllers/authController'
import driverControl from './controllers/driverController'

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
driverRoute.get("/driverData", auth.verifyToken,driverController.getDriverData);
driverRoute.post("/profileUpdate", auth.verifyToken,driverController.profileUpdate);
driverRoute.get("/updateStatus", auth.verifyToken,driverController.updateStatus);




export default driverRoute