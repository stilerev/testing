
const express = require("express");
const path = require("path");
const app = express();

let queries;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.send("Yo");
});

app.get("/api", (req, res) => {
    res.send({
        messages: queries
    });
});

app.get("/15puzzle", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
});


app.get("/callback", (req, res) => {
    queries = req.query;
    res.redirect("/api");
})

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log("Server is running...");
});