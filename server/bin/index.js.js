const express = require("express");
const routes = require("./routes/matrixRoutes");

var app = express();

var port = process.env.port || 3100;

app.listen(port);

app.use(express.json());

app.use(express.static('public'))
app.use(express.static('build'));
app.use(express.static('styles'));
// app.use(express.static('scripts'));
app.use(express.static("node_modules"));

routes(app);

console.log("Matrix calculator living on path " + __dirname);
console.log("Matrix calculator listening on port " + port);

