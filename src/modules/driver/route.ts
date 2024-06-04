import express,{Application} from 'express'
import upload from '../../middleware/multer'
import auth from '../../middleware/auth'
import driverController from './controller'

const driverRoute:Application=express()
const controller= new driverController()

driverRoute.post("/checkLoginDriver", controller.checkLogin);
driverRoute.post("/checkGoogleLoginDriver", controller.checkGoogleLoginDriver);
driverRoute.post("/registerDriver", controller.register);
driverRoute.post("/checkDriver", controller.checkDriver);
driverRoute.post("/location", controller.location);
driverRoute.post(
    "/identification",
    upload.fields([
      { name: "aadharImage", maxCount: 1 },
      { name: "licenseImage", maxCount: 1 },
    ]),
    controller.identificationUpdate
  );

  driverRoute.post(
    "/uploadDriverImage",
    upload.single("driverImage"),
    controller.updateDriverImage
  );


  driverRoute.post(
    "/vehicleDetails",
    upload.fields([
      { name: "carImage", maxCount: 1 },
      { name: "rcImage", maxCount: 1 },
    ]),
    controller.vehicleUpdate
  );


export default driverRoute