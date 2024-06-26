import express,{Application} from 'express'
import userController from './controller'
import upload from '../../middleware/multer'
import { isValidated } from '../auth/controller'

const userRoute:Application=express()

const controller=new userController()


userRoute.post('/checkUser',controller.checkUser)
userRoute.post('/register',upload.single('userImage'),controller.register)
userRoute.post('/resendOtp',controller.resendOtp)


userRoute.post('/checkGoogleLoginUser',controller.checkGoogleLoginUser);
userRoute.post('/checkLoginUser',controller.checkLoginUser);

userRoute.get('/userData',isValidated,controller.getUser);
userRoute.post('/profileUpdate',isValidated,controller.profileUpdate);
userRoute.post('/addWalletBalance',isValidated,controller.addWalletBalance);
userRoute.post('/paymentStripe',isValidated,controller.payment);

export default userRoute