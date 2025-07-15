import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import app from "./app.js";
import DB from "./db/db.js"

app.on("error", (error) => {
    console.error("error: ", error)
    throw error
});

DB().then(() => {
    app.listen(process.env.PORT || 9000, () => {
        console.log(`server is live at: ${process.env.PORT}`)
    });
}).catch((err) => {
    console.error("Mongo connection failed ! " ,err);
})