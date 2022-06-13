const express = require("express");
const http = require("http");
const ws = require("ws");
const { AuthService } = require("./authService");

const app = express();
const server = http.createServer(app);
const wsApp = new ws.Server({ noServer: true });

const authService = new AuthService();

app.post("/login",
    (req, res) => res.send(authService.createToken(req.username, 60000))
);

server.on('upgrade', (request, socket, head) => {
    const authHeader = request.headers.authorization;
    if (!authService.isValid(authHeader)) {
        return socket.destroy();
    }

    wsApp.handleUpgrade(
        request,
        socket,
        head,
        (ws) => wsApp.emit('connection', ws, request)
    );
});

const sendAuthMessage = (socket) => {
    socket.send(JSON.stringify({
        type: "reauthenticate",
        timestamp: Date.now()
    }));
};

const refreshAuthState = (authState, token) => {
    const tokenData = authService.getTokenData(token);
    authState.username = tokenData.username;
    authState.experationDate = tokenData.experationDate;
};

wsApp.on("connection", (socket, request) => {
    const authState = { username: null, experationDate: 0 };
    refreshAuthState(authState, request.headers.authorization);

    socket.on("message", (rawData) => {
        const msgData = JSON.parse(rawData.toString());

        if (msgData.type === "reauthenticate") {
            const newToken = msgData.payload;
            if (!authService.isValid(newToken)) return sendAuthMessage(socket);
            return refreshAuthState(authState, newToken);
        }

        //Handle authentication
        const isValid = authService.isDateValid(authState.experationDate);
        if (!isValid) return sendAuthMessage(socket);

        // Handle message
        console.log(msgData.payload);
        socket.send(JSON.stringify({
            type: "hello",
            payload: "Hello client"
        }));
    });

});

server.listen(
    3000,
    () => console.log("Server Started on http://localhost:3000")
);