import express,{Application} from 'express'
import userAdminController from './controllers/userController'
import driverAdminController from './controllers/driverControlers'
import upload from '../../middleware/multer'
import auth from '../../middleware/auth'

const adminRoute:Application=express()

const userController=new userAdminController()
const driverController=new driverAdminController()


adminRoute.post('/login',userController.login)
adminRoute.get('/getUserData',auth.verifyToken,userController.getData)
adminRoute.get('/blockedUserData',auth.verifyToken,userController.getBlockedData)
adminRoute.post('/blockUser',auth.verifyToken,userController.blockUser)
adminRoute.post('/unblockUser',auth.verifyToken,userController.unblockUser)


adminRoute.get('/pendingDrivers',auth.verifyToken,driverController.pendingDrivers)
adminRoute.get('/verifiedDrivers',auth.verifyToken,driverController.verifiedDrivers)
adminRoute.get('/blockedDrivers',auth.verifyToken,driverController.blockedDrivers)
adminRoute.get('/driverData',auth.verifyToken,driverController.driverData)
adminRoute.post('/verifyDriver',auth.verifyToken,driverController.verifyDriver)
adminRoute.post('/rejectDriver',auth.verifyToken,driverController.rejectDriver)
adminRoute.post('/updateDriverStatus',auth.verifyToken,driverController.updateDriverStatus)





export default adminRoute