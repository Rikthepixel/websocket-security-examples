const https = require("https");
const ws = require("ws");
const { readFileSync } = require("fs");

//Setup the server's Private and Public key for HTTPS
const serverOptions = {
    key: readFileSync("./cert/key.pem"),
    cert: readFileSync("./cert/cert.pem")
};

const server = https.createServer(
    serverOptions,
    (_, res) => res.end("Hello world")
);

const wsServer = new ws.Server({ server });

wsServer.on("connection", (socket) => {

    //Recieve data from the client
    socket.on("message", (data) => {
        console.log(data.toString());
    });

    socket.send("Hello world"); //Send data to the client
});

server.listen(3000, () => console.log("Server started"));