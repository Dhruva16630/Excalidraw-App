import express from "express";
import z from "zod"
const app = express();



app.post("/signup", (req, res) =>{
    const requiredBody = z.object({
        email: z.string().min(3).max(12).email(),
        password: z.string().min(6).max(10).regex(/[A-Z]/,"Password must contain atleast one uppercase").regex(/[0-9]/,"Password must contain at least one number").regex(/[!@#$%^&*(),.?":{}|<>]/,"Password must contain at least one special character"),
        firstName: z.string().min(3).max(10)
    })
})


app.post("/signin", (req, res) => {

})



app.post("/room", (req, res) => {

})
app.listen(3001);