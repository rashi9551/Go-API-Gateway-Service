import express,{Application} from 'express'
import rideControl from './controller'
import { isValidated } from '../auth/controller'

const rideRoute:Application=express()
const rideController=new rideControl()


rideRoute.get('/getCurrentRide',isValidated,rideController.getCurrentRide)

export default rideRoute