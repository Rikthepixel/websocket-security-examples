const express = require("express");
const http = require("http");
const ws = require("ws");

//Some class that handles token creation, validation, encryption and decryption
const { AuthService } = require("./authService");

const app = express();
const server = http.createServer(app);
const wsApp = new ws.Server({ noServer: true });
const authService = new AuthService();

app.post("/login",
    (req, res) => res.send(authService.createToken(req.username, 60000))
);

app.on("upgrade", () => {

});

server.on('upgrade', (request, socket, head) => {
    const authHeader = request.headers.authorization;
    if (!authService.isValid(authHeader)) return socket.destroy();

    wsApp.handleUpgrade(
        request, socket, head,
        (ws) => wsApp.emit('connection', ws, request)
    );
});

const sendJSON = (socket, data) => socket.send(JSON.stringify(data));
const sendAuthMessage = (socket) => sendJSON(socket, {
    type: "reauthenticate", timestamp: Date.now()
});

const refreshAuthState = (authState, token) => {
    const tokenData = authService.getTokenData(token);
    authState.username = tokenData.username;
    authState.experationDate = tokenData.experationDate;
};

const handleReauthMessage = (socket, authState, newToken) => {
    if (!authService.isValid(newToken)) return sendAuthMessage(socket);
    refreshAuthState(authState, newToken);
};

wsApp.on("connection", (socket, request) => {

    const authState = { username: null, experationDate: 0 };
    refreshAuthState(authState, request.headers.authorization);

    socket.on("message", (rawData) => {
        const msgData = JSON.parse(rawData.toString());

        //Handle reauthentication
        if (msgData.type === "reauthenticate")
            return handleReauthMessage(socket, authState, msgData.payload);

        //Handle authentication
        const isValid = authService.isDateValid(authState.experationDate);
        if (!isValid) return sendAuthMessage(socket);

        //Handle message
        sendJSON(socket, {
            type: "hello",
            payload: "Hello client"
        });
    });

});

server.listen(
    3000,
    () => console.log("Server Started on http://localhost:3000")
);