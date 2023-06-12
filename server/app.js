require("dotenv").config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", require("./routes/openai.js"));

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at http://%s:%s", host, port);
});
