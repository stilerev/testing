/*const http = require("http");
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

app.get("/index", (req,res)=>{
    res.render("index");
});

app.get("/callback",(req,res)=>{
    res.render("index");
    console.log(req.params);
});

http.createServer(app).listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});*/
const express = require('express')
const app = express() 

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/hello', (req, res) => {
    //res.json({message: 'Hello World'})
    res.json({hey: req.params.code})
})

const PORT = process.env.PORT || 8081 

app.listen(PORT, () => {
    console.log('Server is running...')
})