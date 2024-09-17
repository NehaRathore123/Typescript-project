import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { vandorPayload } from '../dto';
import { APP_SECRET } from '../config';
import { AuthPayload } from '../dto/Auth.dto';
import { Request } from 'express';

export const GenerateSalt=async ()=>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password:string,salt:string)=>{
    return await bcrypt.hash(password,salt)
}


//validate out password

export const ValidatePassword = async (enterPassword:string, savedPassword:string,salt:string)=>{
    return await GeneratePassword(enterPassword,salt)===savedPassword
}

export const GenerateSignature = (payload: vandorPayload) =>{
    return jwt.sign(payload,APP_SECRET,{expiresIn:'1d'})

}

export const validateSignature = async(req:Request)=>{

    const signature = req.get('Authorization');
    console.log("signature===",signature);
    if(signature){
         
        //  const token = signature.split(' ')[1];
         const token = signature.split(' ')[1];

        const payload = await jwt.verify(token,APP_SECRET) as AuthPayload;
        console.log("payload==",payload);
        
        req.user = payload;
        
        return true;
     }
    return false
}

