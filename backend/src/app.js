const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/auth.routes");
const reportRoutes = require("./routes/report.routes");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials:true
}));
app.use(cookieParser());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);

app.get("/api/health", (req, res) => {
    const healthy = mongoose.connection.readyState === 1;
    res.status(healthy ? 200 : 503).json({
        status: healthy ? "ok" : "degraded",
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof multer.MulterError) {
        const message = err.code === "LIMIT_FILE_SIZE"
            ? "Resume file must be 3 MB or smaller"
            : "Resume must be a PDF file";
        return res.status(400).json({ message });
    }

    if (err.name === "ValidationError" || err.name === "ZodError") {
        return res.status(400).json({ message: "Invalid request data" });
    }

    if (err.code === 11000) {
        return res.status(409).json({ message: "Email or username already exists" });
    }

    res.status(500).json({ message: "Something went wrong" });
});

module.exports = app;