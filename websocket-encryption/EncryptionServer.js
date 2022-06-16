const https = require("https");
const express = require("express");
const ws = require("ws");
const { readFileSync } = require("fs");
const { cwd } = require("process");

//Setup the server's Private and Public key for HTTPS
const serverOptions = {
    key: readFileSync("./cert/key.pem"),
    cert: readFileSync("./cert/cert.pem")
};

const app = express();
const server = https.createServer(serverOptions, app);
const wsServer = new ws.Server({ server });

app.get("/", (_, res) => res.sendFile("./EncryptionServerClientTest.html", { root: cwd() }));
app.get("/EncryptionClient.js", (_, res) => res.sendFile("./EncryptionClient.js", { root: cwd() }));

wsServer.on("connection", (socket) => {

    //Recieve data from the client
    socket.on("message", (data) => {
        console.log(data.toString());
    });

    socket.send("Hello world"); //Send data to the client
});

server.listen(3000, () => console.log("Server started"));