const express = require("express");
const compositionRouter = express.Router();
const {createNewComposition, getSongData, saveComposition} = require("../controllers/compositionControllers");

compositionRouter.post("/createNewComposition", createNewComposition);

compositionRouter.post("/getSongData/:songId", getSongData);

compositionRouter.post("/saveComposition", saveComposition);
module.exports = compositionRouter;
