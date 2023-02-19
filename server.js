const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

//Middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routes
const usersRoutes = require("./routes/users");

//API for Routes
const api = process.env.API_URL;

//Routers
app.use(`${api}/users`, usersRoutes);

//db connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "user-management-database",
  })
  .then(() => {
    console.log("Connected to the user-mangement database");
  })
  .catch((err) => {
    console.log("Failed to connect to the user-mangement database", err);
  });


  //Server
  app.listen(3000, () => {
    // console.log(api);
    console.log("Server listening on port 3000....");
  });
