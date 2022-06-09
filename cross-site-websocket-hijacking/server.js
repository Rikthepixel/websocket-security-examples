const cookie = require("cookie");
const express = require("express");
const http = require("http");
const ws = require("ws");

const app = express();

const server = http.createServer(app);
const wsApp = new ws.Server({ noServer: true });

const password = "Super secret password!!!!";

app.get("/", (req, res) => {
    res.cookie("password", password, { maxAge: 600000 });
    res.send("Here have a cookie 🍪");
});

server.on('upgrade', (request, socket, head) => {
    const cookieHeader = request?.headers?.cookie;
    if (!cookieHeader) return socket.destroy();

    const cookies = cookie.parse(cookieHeader);

    if (cookies?.password !== password) return socket.destroy();

    wsApp.handleUpgrade(request, socket, head, (ws) => {
        wsApp.emit('connection', ws, request);
    });
});

wsApp.on("connection", (socket) => {

    socket.on("message", (data) => {
        console.log(data.toString());
        socket.send("Hello client");
    });

});

server.listen(3000, () => console.log("Server Started on http://localhost:3000 😇"));