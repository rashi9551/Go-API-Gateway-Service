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
                    console.log("result ",result);
                    res.status(StatusCode.Created).json(result.User)
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
    blockUser=(req:Request,res:Response)=>{
        try {
            const {id}=req.query
            console.log(id,req.query,req.params);
            UserService.AdminBlockUser({id},(err:any,result:any)=>{
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
    unblockUser=(req:Request,res:Response)=>{
        try {
            const {id}=req.query
            console.log(id,req.query,req.params);
            UserService.AdminUnblockUser({id},(err:any,result:any)=>{
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