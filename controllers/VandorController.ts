import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInputs } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models";

export const vandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;
  const existingvandor = await FindVandor("", email);
  if (existingvandor !== null) {
    //validation and give access
    const validation = await ValidatePassword(
      password,
      existingvandor.password as string,
      existingvandor.salt as string
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: existingvandor.id,
        email: existingvandor.email as string,
        foodTypes: existingvandor.foodType as [string],
        name: existingvandor.name as string,
      });

      return res.json(signature);
    } else {
      return res.json({ messege: "password is not valid" });
    }
  }
  return res.json({ messege: "Login credemtoal not valid" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingvandor = await FindVandor(user._id);
    return res.json(existingvandor);
  }
  return res.json({ messege: "vendor information not found" });
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodTypes, name, address, phone } = <EditVandorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingvandor = await FindVandor(user._id);
    if (existingvandor !== null) {
      existingvandor.name = name;
      existingvandor.address = address;
      existingvandor.phone = phone;
      existingvandor.foodType = foodTypes;

      const savedResult = await existingvandor.save();
      return res.json(savedResult);
    }
    return res.json(existingvandor);
  }
  return res.json({ messege: "vendor information not found" });
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingvandor = await FindVandor(user._id);
    if (existingvandor !== null) {
      existingvandor.serviceAvailable =
        (!existingvandor.serviceAvailable).toString();

      const savedResult = await existingvandor.save();
      return res.json(savedResult);
    }
    return res.json(existingvandor);
  }
  return res.json({ messege: "vendor information not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const {name,description,category,foodType,readyTime,price}=<CreateFoodInputs>req.body;

    const vandor = await FindVandor(user._id)

    if(vandor!==null){
      const createFood = await Food.create({
        vendorId: vandor._id,
        name:name,
        description:description,
        category:category,
        foodType:foodType,
        images:['mock.jpg'],
        readyTime:readyTime,
        price:price,
        rating:0

      })
      vandor.foods.push(createFood);
      const result = await vandor.save();

      return res.json(result);
    }

  }

  return res.json({ "messege": "something went wrong with add food" });
}



export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
  }

  return res.json({ "messege": "Foods information not found" });
};
