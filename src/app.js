
const express = require("express");
const app = express();

let queries;

app.get("/", (req, res) => {
    res.send("Yo");
});

app.get("api", (req, res) => {
    res.send({
        messages: queries
    });
});


app.get("/callback", (req, res) => {
    queries = req.query;
    res.redirect("/api");
})

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log("Server is running...");
});