import express,{Application} from 'express'
import userController from './controller'
import upload from '../../middleware/multer'
import { isValidated } from '../Auth/controller'

const userRoute:Application=express()

const controller=new userController()

userRoute.post('/testerLogin',controller.testerLogin)

userRoute.post('/checkUser',controller.checkUser)
userRoute.post('/register',upload.single('userImage'),controller.register)
userRoute.post('/resendOtp',controller.resendOtp)


userRoute.post('/checkGoogleLoginUser',controller.checkGoogleLoginUser);
userRoute.post('/checkLoginUser',controller.checkLoginUser);
userRoute.post('/verifyOtp',controller.verifyOtp);

userRoute.get('/userData',isValidated,controller.getUser);
userRoute.post('/profileUpdate',isValidated,controller.profileUpdate);
userRoute.post('/addWalletBalance',isValidated,controller.addWalletBalance);
userRoute.post('/paymentStripe',isValidated,controller.stripePayment);
userRoute.post('/payment',isValidated,controller.RidePayment)
userRoute.post('/razorpayPayment',isValidated,controller.razorpayPayment)
export default userRoute