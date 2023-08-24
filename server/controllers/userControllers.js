const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const UsersModel = require("../Models/Users");


const register = async (req, res) =>{
    //get the username and passowrd from request object
    const username = req.body.username;
    const password = req.body.password;
    if(username==undefined || password == undefined){
      console.log(username, password);
      res.send({success: false, message: "username or password was undefined"})
    }
    
    //check the database to make sure that the username is available
    const result = await UsersModel.findOne({username: username}).exec();
    if(result){
        res.send({success: false, message: "username is already taken"});
        return;
    }
    // if we get here, username is available
    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    //add the new user to the database
      try {
    let newUser = await UsersModel.create({
      username: username,
      password: hash
    });
    console.log("created new user: " + username);
    //add the user as authenticated in the session
    req.session.isAuthentic = true;
    res.send({success: true, message: "Added new user " + username});
  } catch (err) {
    console.log(err);
    res.send({success: false, message: err});
  }
}

const login =  async (req, res) =>{
    //get the username and password from request object
    const username = req.body.username;
    const password = req.body.password;

    //check the database to see if this credential combo matches
    const result = await UsersModel.findOne({username: username});
    if(!result){
        console.log("user " + username + "does not exist in database");
        res.send({success: false, username: "user does not exist"});
        return; 
    }
    //get the hashed password from that user
    const dbHash = result.password;
    //if the password is correct 
    if(bcrypt.compareSync(password, dbHash )){
        //add the user as authenticated in the session
        req.session.isAuthentic = true;
        res.send({success: true, username: username})
    }
    else{
        res.send({success: false, username: "not logged in"});
    }       
}


const logout = async (req, res) => {
 
  console.log(JSON.stringify(req.session));
  req.session.isAuthentic = false;
  
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send({success: false});
    }
    else {
      console.log("logged out successfully");
      console.log(JSON.stringify(req.session));
      res.clearCookie("fermat");
      res.send({success: true});
    }
  });
}


module.exports = {register, login, logout}