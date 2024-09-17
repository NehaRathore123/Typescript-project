import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { vandor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";



export const FindVandor=async(id:string| undefined,email?:string)=>{
  if(email){
    return  await vandor.findOne({email:email})
  }else{
    return await vandor.findById(id)
  }
}


export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVandorInput>req.body;

  // return res.json({name,address,pincode,foodType,email,password,ownerName,phone})

  const existingvandor = await FindVandor('',email);

  if (existingvandor != null) {
    return res.json({ messege: "A vendor is exist with this email id" });
  }

  //generate a salt

  const salt = await GenerateSalt();
  const userpassword = await GeneratePassword(password, salt);

  //encrypt the password using salt

  const createVandor = await vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userpassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods:[]
  });
  return res.json(CreateVandor);
};

export const GetVanndors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

const vandors = await vandor.find()

if(vandors!==null){
  return res.json(vandors)
}
return res.status(404).json({"messege":"vandors data not available"})

};

export const GetVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const vandorId = req.params.id;
  const foundvandor = await FindVandor(vandorId)

  if(foundvandor!==null){
    return res.json(foundvandor);
  }
  return res.status(404).json({"messege":"vandors data not available"})

};
