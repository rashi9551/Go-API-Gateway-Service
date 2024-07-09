import path from "path"
import 'dotenv/config';
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader" 




const packageDef = protoLoader.loadSync(path.resolve(__dirname, '../proto/auth.proto'))
const grpcObject = (grpc.loadPackageDefinition(packageDef) as unknown) as any

const AuthClient = new grpcObject.authpackage.Auth(
    `${process.env.DOMAIN}${process.env.AUTH_GRPC_PORT}`, grpc.credentials.createInsecure()
)

export{AuthClient}