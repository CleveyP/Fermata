const express = require("express");
const compositionRouter = express.Router();
const {createNewComposition, getSongData, saveComposition, getSongsByUsername, deleteComposition} = require("../controllers/compositionControllers");
const AuthMiddleware = require("../middleware/compositionMiddlewares");

compositionRouter.post("/createNewComposition",  AuthMiddleware,  createNewComposition);

compositionRouter.post("/getSongData/:songId",  getSongData);

compositionRouter.post("/saveComposition",  AuthMiddleware, saveComposition);

compositionRouter.post("/getSongsByUsername",  AuthMiddleware, getSongsByUsername);

compositionRouter.post("/delete",  AuthMiddleware, deleteComposition);

module.exports = compositionRouter;
