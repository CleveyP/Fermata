//everything that the server has to do is right here

let express  = require('express');
let bodyParser = require('body-parser');

const {connectMongo} = require('./config/mongoConnection');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const UsersModel = require("./Models/Users");
const userRouter = require('./routes/userRoutes');
const compositionRouter = require('./routes/compositionRoutes');
connectMongo();

let app = express();
const router = express.Router();
// app.use(express.json());
app.use(bodyParser.json({limit: '1mb'}));
app.use(cors());
app.use("/user", userRouter);
app.use("/composition", compositionRouter);




const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
})