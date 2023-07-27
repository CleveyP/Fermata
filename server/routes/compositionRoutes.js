const express = require("express");
const compositionRouter = express.Router();
const {createNewComposition, getSongData, saveComposition, getSongsByUsername} = require("../controllers/compositionControllers");

compositionRouter.post("/createNewComposition", createNewComposition);

compositionRouter.post("/getSongData/:songId", getSongData);

compositionRouter.post("/saveComposition", saveComposition);

compositionRouter.post("/getSongsByUsername", getSongsByUsername);

module.exports = compositionRouter;
