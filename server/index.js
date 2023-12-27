import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();
const port = process.env.PORT;
const mongourl = process.env.MONGODB_URL
const app = express();

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);

const connectDb = async () => {
    try{
        await mongoose.connect(mongourl);
        console.log(`Mongodb database is connected`)
    }catch(err){
        console.log(err)
    }
}

app.listen(port, () => {
    connectDb();
    console.log(`app is listening on port ${port}`)
})
