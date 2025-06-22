import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_CHAT } from "./secret";
import express, { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      userId: JwtPayload | string;
    }
  }
}

const app = express();
app.use(express.json());



export function middleware( req:Request, res:Response, next:NextFunction ){
    const token = req.headers.authorization
    
    try{
       if( !token || !JWT_SECRET_CHAT)return
        const decoded = jwt.verify( token, JWT_SECRET_CHAT);
        req.userId= decoded;
        next();
    }catch{
        res.status(401).json({
            error:'Unauthorised'
        })
    }
    

    
}