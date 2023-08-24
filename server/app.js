//everything that the server has to do is right here

let express  = require('express');
let bodyParser = require('body-parser');

const {connectMongo} = require('./config/mongoConnection');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const mongoSession = require("./config/session");
const UsersModel = require("./Models/Users");
const userRouter = require('./routes/userRoutes');
const compositionRouter = require('./routes/compositionRoutes');
const path = require("path")


//connect to the mongo db
connectMongo();

let app = express();

const router = express.Router();
// app.use(express.json());
app.use(bodyParser.json({limit: '1mb'}));
app.use(cors({
	origin: true,
	credentials: true
}));
//connect the express session to the mongodb so the session is stored in the database not in the server memory.
mongoSession(app);

app.use("/user", userRouter);
app.use("/composition", compositionRouter);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle requests that don't match any routes by serving the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


app.get("/", (req, res) =>{
	res.send("hello test!!!");
})



const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
})