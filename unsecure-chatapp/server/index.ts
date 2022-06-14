import Express from 'express';
import path from 'path';
const app = Express();
const clientPath = path.join(__dirname, "../client");

app.use("/public", Express.static(
    path.join(clientPath, "/public")
));

app.get("*", (req, res) => {
    return res.sendFile(
        path.join(clientPath, "/index.html"),
    );
});

app.listen(3001, () => console.log("App started on http://localhost:3001"));
