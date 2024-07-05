import {Response,Request} from 'express'
import { UserService } from '../../user/config/grpc-client/user.client';
import { StatusCode } from '../../../interfaces/enum'
import rideController from '../../ride/controller';
import driverController from '../../driver/controllers/driverController';
import userController from '../../user/controller';
import { DashboardData } from '../../../interfaces/interface';
import { monthNames } from '../../../utils/generatePIN';

const rideControll=new rideController()
const driverControll=new driverController()
const userControll=new userController()

export default class userAdminController{
    login=(req:Request,res:Response)=>{
        try {
            console.log(req.body,"dhgfavjhsd");
            UserService.AdminLogin(req.body,(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
            
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    getData=(req:Request,res:Response)=>{
        try {
            UserService.AdminGetData({},(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("vanney",result);
                    res.status(StatusCode.Created).json(result.User)
                }
            })
            
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    userData=(req:Request,res:Response)=>{
        try {
            UserService.AdminGetUserData(req.query,(err:any,result:any)=>{
                if(err){
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ithu",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
            
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    getBlockedData=(req:Request,res:Response)=>{
        try {
            UserService.AdminGetBlockedData({},(err:any,result:any)=>{
                if(err){
                    console.log(err);
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result.User)
                }
            })
            
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    updateUserStatus=(req:Request,res:Response)=>{
        try {
            const {id}=req.query
            console.log(id,req.query,req.params);
            UserService.AdminUpdateUserStatus({id,...req.body},(err:any,result:any)=>{
                if(err){
                    console.log(err);
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result)
                }
            })
            
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    dashboardData=(req:Request,res:Response)=>{
        try {
            console.log("dashboard data");
            UserService.AdminDashboardData({},async(err:any,result:DashboardData)=>{
                if(err){
                    console.log(err);
                    res.status(StatusCode.BadRequest).json({message:err})
                }else{
                    const userData=result.stats
                    const pieChartData=await rideControll.dashboardData()
                    const driver=await driverControll.dashboardData()
                    // console.log("result ",result,pieChartData,userData,driver);
                    const driverData=driver.response
                    const chardData = userData.map((userItem:{userCount:number,month:number}, index:number) => ({
                        name: monthNames[userItem.month - 1],
                        users: userItem?.userCount || 0,
                        drivers: driverData[index]?.driverCount || 0,
                    }));
                    const totalUsers = result.totalUsers
                    const blockedUsers = result.blockedUsers
                    const totalDrivers =driver.totalDrivers
                    const blockedDrivers = driver.blockedDrivers
                    const newDrivers = driver.pendingDrivers
                    res.status(StatusCode.Created).json({ chardData, pieChartData, dashboardData:{totalUsers,totalDrivers,blockedUsers,blockedDrivers,newDrivers} })
                }
            })
            
        } catch (error) {
            console.log(error);
            return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });

        }
    }
    
}