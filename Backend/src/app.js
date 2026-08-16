import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import morgan from "morgan"
import cors from "cors"
import chatRouter from "./routes/chat.routes.js";
const app = express();


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
}))
// Explicit health API for cron polling
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// Serve static frontend from the 'dist' folder
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route for SPA routing (React/Vue/etc.)
app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
export default app;