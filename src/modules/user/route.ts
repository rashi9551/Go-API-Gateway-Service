import express,{Application} from 'express'
import userController from './controller'
import upload from '../../middleware/multer'
import auth from '../../middleware/auth'
const userRoute:Application=express()

const controller=new userController()


userRoute.post('/checkUser',controller.checkUser)
userRoute.post('/register',upload.single('userImage'),controller.register)
userRoute.post('/resendOtp',controller.resendOtp)


userRoute.post('/checkGoogleLoginUser',controller.checkGoogleLoginUser);
userRoute.post('/checkLoginUser',controller.checkLoginUser);

userRoute.get('/userData',auth.verifyToken,controller.getUser);
userRoute.post('/profileUpdate',auth.verifyToken,controller.profileUpdate);

export default userRoute