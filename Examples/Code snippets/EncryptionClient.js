const unecryptedSocket = new WebSocket("ws://localhost:3000");
const encryptedSocket = new WebSocket("wss://localhost:3000");
encryptedSocket.onopen = () => {
    encryptedSocket.send("Hello world");
};
