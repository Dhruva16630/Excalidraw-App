// console.log("middleware.ts loaded");



import jwt, { JwtPayload } from "jsonwebtoken";
import express,{ NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      userID?: string | JwtPayload;
    }
  }
}
const app = express();
app.use(express.json());

export function middleware(req: Request, res: Response, next: NextFunction): void {
  // console.log("Inside middleware");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header missing or malformed" });
    return
  }

  const token = authHeader.split(" ")[1];

  const jwtSecret = process.env.JWT_SECRET;
  // console.log("JWT Secret:", jwtSecret);
  // console.log("Token:", token); 
  if (!jwtSecret) {
    res.status(500).json({ error: "JWT_SECRET not set in environment" });
    return
  }
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // console.log("Decoded token:", decoded);
    req.userID = decoded;
    // console.log("Token verified");
    res.json({
      message: "Token is valid",})
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return
  }
}

