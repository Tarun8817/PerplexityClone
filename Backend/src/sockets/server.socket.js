import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {

    io = new Server(httpServer, {
        cors: {
            origin: true, // Allow any origin dynamically to fix socket CORS errors
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        },
    });

    console.log("Socket io server is running")
    io.on("connection", (socket) => {

        console.log(
            "A user connected: " + socket.id
        );

        socket.on("disconnect", () => {
            console.log(
                "User disconnected: " + socket.id
            );
        });
    });
}

export function getIo() {
    if(!io){
        throw new Error("Socket.io not initialized")
    }

    return io;
}