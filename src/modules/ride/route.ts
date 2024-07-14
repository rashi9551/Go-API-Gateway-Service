import express,{Application} from 'express'
import rideControl from './controller'
import { isValidated } from '../Auth/controller'

const rideRoute:Application=express()
const rideController=new rideControl()


rideRoute.get('/getCurrentRide',isValidated,rideController.getCurrentRide)
rideRoute.get('/getAllRides',isValidated,rideController.getAllRides)

export default rideRoute