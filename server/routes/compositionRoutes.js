const express = require("express");
const compositionRouter = express.Router();
const {createNewComposition, getSongData} = require("../controllers/compositionControllers");

compositionRouter.post("/createNewComposition", createNewComposition);

compositionRouter.post("/getSongData/:songId", getSongData);

module.exports = compositionRouter;
