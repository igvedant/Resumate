const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);

module.exports = app;