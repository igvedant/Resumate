require('dns/promises').setServers(["1.1.1.1","8.8.8.8"]);
require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log("Server is running on port: " + PORT );
        });
    } catch (error) {
        console.error("Unable to start server", error);
        process.exit(1);
    }
}

startServer();