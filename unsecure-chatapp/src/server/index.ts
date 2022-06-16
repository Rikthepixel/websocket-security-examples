import Express from 'express';
import path from 'path';
import "./logic";
import apiRoutes from "./api";
import bodyParser from 'body-parser';
const app = Express();
const clientPath = path.join(__dirname, "../client");

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

app.listen(3001, () => console.log("App started on http://localhost:3001"));
