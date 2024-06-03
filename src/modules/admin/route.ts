import express,{Application} from 'express'
import adminController from './controller'
import upload from '../../middleware/multer'
import auth from '../../middleware/auth'

const adminRoute:Application=express()

const controller=new adminController()

adminRoute.post('/login',controller.login)
adminRoute.get('/getUserData',auth.verifyToken,controller.getData)
adminRoute.get('/blockedUserData',auth.verifyToken,controller.getBlockedData)
adminRoute.post('/blockUser',auth.verifyToken,controller.blockUser)
adminRoute.post('/unblockUser',auth.verifyToken,controller.unblockUser)




export default adminRoute