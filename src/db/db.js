import mongoose from "mongoose";
import { DB_Name } from "../const.js";

const DB = async () => {
    try {
        const dbConnection = await mongoose.connect(`${process.env.MongooDB_URL}/${DB_Name}`);
        console.log(`data base has been connected: ${dbConnection.connection.host}`)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }   
}

export default DB;