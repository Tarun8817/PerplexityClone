import "dotenv/config";
import https from "https";
import { CronJob } from "cron";
import http from "http";

import app from "./src/app.js";

import connectDB from "./src/config/database.js";

import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB()
    .catch((err) => {
        console.error(
            "MongoDB connection failed:",
            err
        );

        process.exit(1);
    });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Self-ping to keep Render free tier instance awake
    const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_EXTERNAL_URL) {
        const job = new CronJob("*/5 * * * *", () => {
            const healthUrl = `${RENDER_EXTERNAL_URL}/api/health`;
            https.get(healthUrl, (resp) => {
                console.log(`[Cron] Pinged ${healthUrl} to keep awake - Status: ${resp.statusCode}`);
            }).on("error", (err) => {
                console.error(`[Cron] Error pinging server:`, err.message);
            });
        });
        job.start();
    }
});