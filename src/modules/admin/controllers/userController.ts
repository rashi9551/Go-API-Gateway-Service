import {Response,Request} from 'express'
import { UserService } from '../../user/config/grpc-client/user.client';
import { StatusCode } from '../../../interfaces/enum'
import { log } from '@grpc/grpc-js/build/src/logging';

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
        }
    }
    
}