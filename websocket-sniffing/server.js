const express = require("express");
const http = require("http");
const { cwd } = require("process");
const ws = require("ws");

const app = express();
const server = http.createServer(app);
const wsApp = new ws.Server({ server });

app.get("/", (_, res) => res.sendFile("client.html", { root: cwd() }));

wsApp.on("connection", (socket) => {

    socket.on("message", (data) => {
        console.log(data.toString());
        socket.send("Hello client");
    });

});

server.listen(3000, () => console.log("Server Started on http://localhost:3000"));