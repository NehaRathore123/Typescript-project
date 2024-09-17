import express, { Request, Response, NextFunction } from "express";
import { AddFood, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, vandorLogin } from "../controllers/VandorController";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post('/login',vandorLogin);

router.use(Authenticate);
router.get('/profile', GetVandorProfile)
router.patch('/profile',UpdateVandorProfile)
router.patch('/service',UpdateVandorService)

router.post("/food",AddFood)
router.get("/foods")

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({messege:"Hello from vendor"})
});

export { router as VendorRoute };
