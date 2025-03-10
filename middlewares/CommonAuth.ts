
import { Request,Response,NextFunction } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { validateSignature } from "../utility";


declare global {
    namespace Express {
      interface Request {
        user?: AuthPayload;
      }
    }
  }

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    //  console.log("req==",req);
    
    const validate = await validateSignature(req);
    console.log("validate==",validate);
    
    if (validate) {
    next()
    }else{
    return res.json({"message": "user not Authorized"})
    }
}