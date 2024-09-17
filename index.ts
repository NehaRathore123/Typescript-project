import express from 'express';
import mongoose from 'mongoose';
import {AdminRoute,VendorRoute} from './routes'
import { MONGO_URL } from './config';
import bodyParser from 'body-parser';

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/admin",AdminRoute);
app.use("/vandor",VendorRoute);

mongoose.connect(MONGO_URL, {
}).then(() => {
  console.log(' DB Connected ');
}).catch((error) => {
  console.error('Connection error:', error);
});

app.listen(8000, ()=>{
    console.log("App is listning on the port 8000")
})