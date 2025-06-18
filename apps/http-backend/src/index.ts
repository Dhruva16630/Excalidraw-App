import express, { Request, Response } from "express";
import { SignupZod, SigninZod } from "@repo/common/types";
import { prisma } from "@repo/db/client";
import bcrypt from "bcrypt";
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
    const { email, password, username } = req.body;

   try{
    const existingUser = await prisma.user.findUnique({
        where: { 
            email: paresdData.data.email },
    })
    if(existingUser){
        res.status(400).json({
            message: "User already exist"
        })
    }
    const hashedPassword = await bcrypt.hash(paresdData.data.password,10);

    await prisma.user.create({
        data:{
            email:paresdData.data.email,
            password:hashedPassword,
            username:paresdData.data.username
        }
    })
   }catch{
    res.status(500).json({
        message: "An unexpected error occured"
    })
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
     const { email, password } = req.body;

      try{
        const checkUser = await prisma.user.findUnique({
        where:{ 
            email:parsed.data?.email,
         }    
      })

      if(!checkUser){
        res.status(404).json({
            message:"User not found"
        })
        return
      }
      
      const isPasswordValid = await bcrypt.compare(password, checkUser?.password )
      if(isPasswordValid){
       
      }
      }catch{

      }
      
    
})



app.post("/room", (req, res) => {

})
app.listen(3001);