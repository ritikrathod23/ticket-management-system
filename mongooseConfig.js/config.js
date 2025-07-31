import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGOOSE_URL
// console.log("url :", url)

const mongooseConnect = () => {
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("connect to mongoDb"))
    .catch((error) => console.log("can not connect to mongoDB", error));
};


export default mongooseConnect;