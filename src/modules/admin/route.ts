import express,{Application} from 'express'
import userAdminController from './controllers/userController'
import driverAdminController from './controllers/driverControlers'
import upload from '../../middleware/multer'
import { isValidated } from '../Auth/controller'

const adminRoute:Application=express()

const userController=new userAdminController()
const driverController=new driverAdminController()


adminRoute.post('/login',userController.login)
adminRoute.get('/getUserData',isValidated,userController.getData)
adminRoute.get('/userData',isValidated,userController.userData)
adminRoute.get('/blockedUserData',isValidated,userController.getBlockedData)
adminRoute.post('/updateUserStatus',isValidated,userController.updateUserStatus)


adminRoute.get('/pendingDrivers',isValidated,driverController.pendingDrivers)
adminRoute.get('/verifiedDrivers',isValidated,driverController.verifiedDrivers)
adminRoute.get('/blockedDrivers',isValidated,driverController.blockedDrivers)
adminRoute.get('/driverData',isValidated,driverController.driverData)
adminRoute.post('/verifyDriver',isValidated,driverController.verifyDriver)
adminRoute.post('/rejectDriver',isValidated,driverController.rejectDriver)
adminRoute.post('/updateDriverStatus',isValidated,driverController.updateDriverStatus)





export default adminRoute