const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

// Allow Express to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Serve `index.html` when visiting the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// WebSocket logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-channel", (channel) => {
        socket.join(channel);
        console.log(`${socket.id} joined ${channel}`);
    });

    socket.on("voice", (data) => {
        socket.to(data.channel).emit("voice", data.audio);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Use the port provided by Render OR default to 3000 locally
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
