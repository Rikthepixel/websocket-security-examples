import Express from 'express';
import https from "https";
import path from 'path';
import "./logic";
import apiRoutes from "./api";
import bodyParser from 'body-parser';
import cors from "cors";
import { readFileSync } from 'fs';
const app = Express();
const clientPath = path.join(__dirname, "../client");
const certPath = path.join(__dirname, "/cert");

const server = https.createServer({
    key: readFileSync(path.join(certPath, "/key.pem")),
    cert: readFileSync(path.join(certPath, "./cert.pem"))
}, app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", Express.static(
    path.join(clientPath, "/public")
));

const sendSPA = (res) => res.sendFile(
    path.join(clientPath, "/index.html"),
);

app.get("/", (_, res) => sendSPA(res));
app.get("/login", (_, res) => sendSPA(res));
app.get("/register", (_, res) => sendSPA(res));

app.use("/api", apiRoutes);

server.listen(3001, () => console.log("App started on https://localhost:3001"));
