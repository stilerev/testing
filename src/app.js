const http = require("http");
const express = require("express");
const app = express();

const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
    res.render("index");
    //res.sendFile(__dirname + "/views/index");
});

app.get("/*",(req,res)=>{
    res.render("index");
    console.log(req);
});

http.createServer(app).listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});