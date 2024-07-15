import compression from 'compression'
import cors from 'cors'
import express from 'express'
import {Application} from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import http from 'http'
import userRoute from './modules/user/route'
import 'dotenv/config';
import adminRoute from './modules/admin/route'
import driverRoute from './modules/driver/route'
import rideRoute from './modules/ride/route'
import authRoute from './modules/Auth/route'
import { setUpSocketIO } from "./services/socket";
import { limiter } from './utils/rateLimitter'

class App{
    public app:Application;
    server:http.Server<typeof http.IncomingMessage,typeof http.ServerResponse>

    constructor(){
        this.app=express()
        this.server=http.createServer(this.app)
        setUpSocketIO(this.server)
        this.applyMiddleware()
        this.routes()
    }
    
    private applyMiddleware(): void {
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(
          cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
          })
        );
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(logger("dev"));
        this.app.use(cookieParser());
        this.app.use(limiter)
    }

    private routes():void{
        console.log(process.env.SOCKET_FRONTEND_URL,"djfgdh");
        this.app.use('/api/user',userRoute)
        this.app.use('/api/admin',adminRoute)
        this.app.use('/api/driver',driverRoute)
        this.app.use('/api/ride',rideRoute)
        this.app.use('/api/auth',authRoute)
    }

    public startServer(port:number):void{
        this.server.listen(port,()=>{
            console.log(`API-Gateway started on with the help of kubernet ${port}`);
            
        })
    }

}
export default App