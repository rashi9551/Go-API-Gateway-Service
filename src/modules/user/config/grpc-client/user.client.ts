import path from 'path'
import 'dotenv/config';
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'



const packageDef = protoLoader.loadSync(path.resolve(__dirname,'../proto/user.proto'))
const grpcObject=(grpc.loadPackageDefinition(packageDef)as unknown)as any

const UserService = new grpcObject.user_package.User(
    `localhost:${process.env.USER_GRPC_PORT}`,grpc.credentials.createInsecure()
)

export {UserService}