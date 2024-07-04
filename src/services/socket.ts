import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { RideDetails } from '../interfaces/mongo';
import {generatePIN} from '../utils/generatePIN'
import rideRabbitMqClient from '../modules/ride/rabbitmq/client'
import driverRabbitMqClient from "../modules/driver/rabbitmq/client";
import {UserService} from '../modules/user/config/grpc-client/user.client'
import jwt from 'jsonwebtoken';
import axios from "axios";
import { ChatMessage } from "../interfaces/interface";

interface Driver {
    _id: string;
}

interface DecodedToken {
  clientId: string;
}

interface AuthenticatedSocket extends Socket {
  decoded?: DecodedToken;
}


const calculateDistance=(driverLatitude:number,driverLongitude:number,userLatitude:number,userLongitude:number)=>{
    const deg2rad = (deg: any) => deg * (Math.PI / 180);
    driverLatitude = deg2rad(driverLatitude);
    driverLongitude = deg2rad(driverLongitude);
    userLatitude = deg2rad(userLatitude);
    userLongitude = deg2rad(userLongitude);

    const radius = 6371;

    const dlat = userLatitude - driverLatitude;
    const dlon = userLongitude - driverLongitude;

    const a = Math.sin(dlat / 2) ** 2 + Math.cos(driverLatitude) * Math.cos(driverLongitude) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = radius * c;

    return distance;
}


export const setUpSocketIO = (server: HttpServer): void => {
  
  let driverLatitude: number;
  let driverLongitude: number;
  let rideDetails: RideDetails;
  const io: SocketIOServer = new SocketIOServer(server, {
    cors: {
      origin: process.env.SOCKET_FRONTEND_URL,
      credentials: true,
    },
  });
  

  io.use((socket:AuthenticatedSocket, next) => {
    const token: string | undefined = socket.handshake.query.token as string | undefined;
    const refreshToken: string | undefined = socket.handshake.query.refreshToken as string | undefined;
    if (!token) {
      return next(new Error('Authentication error'));
    }else{
      jwt.verify(token, process.env.JWT_SECRET as string,async (err:any, decoded:any) => {
        if (err) {
          if(!refreshToken){
            console.log(err,"ithu socket")
            return next(new Error('Authentication error'));
          }
          else{
   
            try {
              const { data } = await axios.post('http://localhost:3000/api/auth/refresh', { token: refreshToken });
              console.log(data, "jhfhgfjkghfxch-0-=0-0=-=-=0-0-=");
              socket.emit('tokens-updated', {
                token: data.token,
                refreshToken: data.refreshToken,
              });
            } catch (error:any) {
              console.error('Error refreshing token:', error.message);
              return next(new Error('Authentication error'));
            }
          }
        }
        socket.decoded = decoded 
        next();
      
      });
      
    } 
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);
    socket.on("getNearByDrivers", async(rideData: RideDetails) => {
      console.log("nearby drivers edukkunu");
      
      rideDetails = rideData;
      console.log(rideDetails,"ride details");
      
      io.emit("getNearByDrivers");
    });

    socket.on("driverLocation", async(latitude: number, longitude: number, driver_id: string) => {
        try {
          console.log("driver location kitty");
            driverLatitude=latitude
            driverLongitude=longitude
            const distance=calculateDistance(driverLatitude,driverLongitude,rideDetails.pickupCoordinates.latitude,rideDetails.pickupCoordinates.longitude)

            if(distance<=5){   
                const driverIds:unknown=await driverRabbitMqClient.produce({ vehicleModel:rideDetails.vehicleModel}, 'findNearbyDrivers');
                const driver: Driver[] = driverIds as Driver[];
                const ArrayOfIds=driver.map((driver)=>driver._id)
                console.log(ArrayOfIds);
                
                io.emit("newRideRequest",rideDetails,ArrayOfIds)
            }else{
                console.log("grater tha 5 km");
            }
            
        } catch (error) {
            console.error("Error handling driver location:", error);
        }
    }
    );

    socket.on("acceptRide",async(acceptedRideData:RideDetails)=>{
      try {
        acceptedRideData.status="Pending";
        acceptedRideData.pin=generatePIN()
        
        acceptedRideData.driverCoordinates = {};
        acceptedRideData.driverCoordinates.latitude = driverLatitude;
        acceptedRideData.driverCoordinates.longitude = driverLongitude;
        
        console.log(acceptedRideData,"data sended  ");
        const response = await rideRabbitMqClient.produce(acceptedRideData,"ride-create")
      //   const responses=await driverRabbitMqClient.produce({driverId:acceptedRideData.driver_id},"updateDriverStatus")
      //   console.log(responses,"ithu update response");
        console.log(response,"ithu ride response");
        io.emit("driverConfirmation",acceptedRideData.ride_id)
      } catch (error) {
        console.log(error);
      }
    })

    socket.on('forUser',async(ride_id:any)=>{
      io.emit("userConfirmation",ride_id)
    })

    socket.on("verifyRide", async (pin: number) => {
      console.log("pin check",pin);
      const response = await rideRabbitMqClient.produce(pin,"ride-confirm")
      if(response){
        console.log("ride confirmed ------=-=-=-=-==-=-   ");
          io.emit("rideConfirmed")
      }else{
          io.emit("error in confirming ride")
      }
    });

    socket.on("driverRideFinish",()=>{
      io.emit("userPaymentPage")
    })

    socket.on("paymentCompleted",(paymentMode:string,amount:number)=>{
      io.emit("driverPaymentSuccess",paymentMode,amount)
  })
    socket.on("chat",(chat:ChatMessage[])=>{
      console.log(chat);
      io.emit("chat",chat)
  })

    socket.on("rideCancelled", async (ride_id)=>{
      try {
        console.log("ride called triggered");  
        const rideData = await rideRabbitMqClient.produce({ride_id},"update-ride-status") as RideDetails
        console.log(rideData,"ride data updated");
        if(rideData){
            // const responses=await driverRabbitMqClient.produce({driverId:rideData.driver_id},"updateDriverStatus")
            // console.log(responses,"ithu update response");
        } else{
          console.log("No ride data");
        } 
        if(rideData){
          UserService.rideCancelUpdate({userId:rideData?.user_id},(err:any,result:any)=>{
              if(err){
                  console.log(err);
              }else{
                console.log("ride cancel updated successfuly",result);
                io.emit("rideCancelled")
              }
          })
        }else{
          console.log("No ride data");
        } 
      } catch (error) {
          console.log((error as Error).message);
      }
    })
  });
};
