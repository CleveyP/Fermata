const express = require("express");
const userRouter = express.Router();
const {register, login, logout} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/compositionMiddlewares")

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/logout", logout);

module.exports = userRouter;
