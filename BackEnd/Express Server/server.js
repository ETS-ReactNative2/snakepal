const express = require("express");
const app = express();

require("dotenv").config();

const bodyParser = require("body-parser");
const PORT = 8080;
const cors = require("cors");

const mongoose = require("mongoose");

const userRoute = require("./app/routers/user.router");
const detectionRoute = require("./app/routers/detection.router");

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    (err) => {
      console.log("Can not connect to the database" + err);
    }
  );

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", userRoute);
app.use("/detection", detectionRoute);

// Create a Server
const server = app.listen(PORT, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
