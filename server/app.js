//everything that the server has to do is right here

let express  = require('express');
const {connectMongo} = require('./config/mongoConnection');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const UsersModel = require("./Models/Users");
const userRouter = require('./routes/userRoutes');
connectMongo();

let app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());
app.use("/", userRouter);



// app.get('/', function(req, res) {
// 	res.send('<h1>Welcome to Node.js project setup</h1>')
// })


// app.post("/register",  async (req, res) =>{
//     //get the username and passowrd from request object
//     const username = req.body.username;
//     const password = req.body.password;

//     //check the database to make sure that the username is available
//     const result = await UsersModel.findOne({username: username}).exec();
//     if(result){
//         res.send({success: false, message: "username is already taken"});
//     }
//     // if we get here, username is available
//     //hash password
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(password, salt);
//     //add the new user to the database
//       try {
//     let newUser = await UsersModel.create({
//       username: username,
//       password: hash
//     });
//     console.log(newUser);
//     console.log("created new user: " + username);
//     res.send({success: true, message: "Added new user " + username});
//   } catch (err) {
//     console.log(err);
//     res.send({success: false, message: err});
//   }
// })



// app.post("/login", async (req, res) =>{
//     //get the username and password from request object
//     const username = req.body.username;
//     const password = req.body.password;

//     //check the database to see if this credential combo matches
//     const result = await UsersModel.findOne({username: username});
//     console.log(result);
//     //get the hashed password from that user
//     const dbHash = result.password;
//     //if the password is correct 
//     if(bcrypt.compareSync(password, dbHash )){
//         res.send({success: true, username: username});
//     }
//     else{
//         res.send({success: false, username: "not logged in"});
//     }

       
// })


const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log(`Server started on port: ${PORT}`);
})