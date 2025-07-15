import express, { Request, Response } from "express";
import { SignupZod, SigninZod } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { middleware } from "@repo/backend-common/middleware"
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve(__dirname,"../../../.env") })
const app = express();
app.use(express.json());




app.post("/signup", async ( req: Request, res: Response ) =>{
   const paresdData = SignupZod.safeParse(req.body);
   if(!paresdData.success){ 
    res.status(400).json({
        message: "Incorrect Credentials",
        error: paresdData.error.errors
    })
    return
   }

   try{
    const existingUser = await prisma.user.findUnique({
        where: { 
            email: paresdData.data.email },
    })
    if(existingUser){
        res.status(400).json({
            message: "User already exist"
        })
        return
    }
    const hashedPassword = await bcrypt.hash(paresdData.data.password,10);
    
    const user = await prisma.user.create({
        data:{
            email:paresdData.data.email,
            password:hashedPassword,
            username:paresdData.data.username
        }
    })
    res.json({
        message: "user created",
        user :{
            id : user.id,
            hesru: user.username,
            gmail: user.email,
            password: user.password
        }
    })
    return
   }catch{
    res.status(500).json({
        message: "An unexpected error occured"
    })
    return
   }
})


app.post("/signin", async ( req: Request , res: Response ) => {
      const parsed = SigninZod.safeParse(req.body);
      if(!parsed.success){
        res.status(400).json({
            message:"Incorrect Credentials format",
            error: parsed.error.errors
        })
        return
      }
     
      try{
        const checkUser = await prisma.user.findUnique({
        where:{ 
            email:parsed.data.email,
         }    
      })

      if(!checkUser){
        res.status(404).json({
            message:"Invalid Email or Password"
        })
        return
      }
      
      const isPasswordValid = await bcrypt.compare(parsed.data.password, checkUser.password )
      if( process.env.JWT_SECRET == null ){
        res.status(500).json({
            message: "Unexpected Error"
        })
        return
      }

      if(isPasswordValid){
       const token = jwt.sign({
        userID:checkUser.id
       }, process.env.JWT_SECRET,{
        expiresIn:"28d"
       });
       res.json({
        token:token
       })
       return
      }else{
        res.status(403).json({
            message: "Incorrect Email or Password"
        })
        return
      }
      
      }catch(error){
        res.status(500).json({
            message:"Server error"
        })
      }
      return  
})



app.post("/room", middleware, (req: Request, res: Response) => {
    try {
        // console.log("indise room");
        res.json({
            message: "Room endpoint reached"
        });
    } catch (error) {
        res.status(500).json({
            message: "error code"
        });
    }
});



app.listen(3001, ()=>{
    console.log("Server is running in port 3001")
});