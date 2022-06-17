const express = require("express");
const { cwd } = require("process");
const app = express();

app.get("/", (_, res) => res.sendFile("maliciousPage.html", { root: cwd() }));
app.listen(8000, () => console.log("Started doing evil stuff on http://localhost:8000 😈"));