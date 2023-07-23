const express = require("express");
const userRouter = express.Router();
const {register, login} = require("../controllers/userControllers");

userRouter.post("/login", login);

userRouter.post("/register", register);

module.exports = userRouter;
