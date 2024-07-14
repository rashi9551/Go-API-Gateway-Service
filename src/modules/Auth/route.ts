import express,{Application} from 'express'
import { refreshToken } from './controller'

const rideRoute:Application=express()


rideRoute.post('/refresh',refreshToken)

export default rideRoute