const express = require("express");
const compositionRouter = express.Router();
const {createNewComposition} = require("../controllers/compositionControllers");

compositionRouter.post("/createNewComposition", createNewComposition);


module.exports = compositionRouter;
