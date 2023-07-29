const mongoose = require("mongoose");
const CompositionsModel = require("../Models/Compositions");
const ObjectId = mongoose.Types.ObjectId;

const createNewComposition = async (req, res) =>{
    //get the data about the new composition
    const songName = req.body.songName;
    const numBars = req.body.numberOfBars;
    const timeSig = req.body.timeSignature;
    const username = req.body.username;
    const compositionArray = req.body.compositionArray;
    console.log(songName, numBars, timeSig);
    //generate new id for the song 
    //put the song in the CompositionModel in the db
    try {
        let newComposition = await CompositionsModel.create({
          title: songName,
          numBars: numBars,
          timeSignature: timeSig,
          author: username,
          compositionArray:  compositionArray
        });
        const songId = newComposition._id;
        res.send({success: true, songId: songId});
        
      } catch (err) {
        console.log(err);
        res.send({success: false, message: err});
      }
    //send a success object if everything goes as planned
    //and send the composition id back as well
    //otherwise send a success false objec
}

const getSongData = async (req, res) =>{
    const songId = req.params.songId;
   
    //query database by songId
    //get the song data and return to user
    const songData = await CompositionsModel.findById(songId);
    
    if(songData){
        res.send({
          success: true,
          songTitle: songData.title,
          numBars: songData.numBars,
          timeSig: songData.timeSignature,
          compositionArray: songData.compositionArray 
        });
    }
    else{
        res.send({success:false});
    }
}

const getSongsByUsername = async (req, res) =>{
  //get the username from the req object
  const username = req.body.username;
  console.log("username" + username);
  //get the compositions titles and songIds that were made by the username user

const authorQuery = { author: username }; 


const fieldsToInclude = "_id title";


const result = await CompositionsModel.find(authorQuery, fieldsToInclude);
  if (!result) {
    console.error("Error executing the query:");
    res.send({success: false});
  } else {
    console.log("Result:", result);
    res.send({success: true, songsList: result})
  }
}


const saveComposition = async (req, res) =>{
  //get the composition json array from req
  const compositionArray = req.body.composition;
  //get the songId from req
  const songId = req.body.songId;
  //update the compositionModel's jsonArray where  _songId ==  songId 
  let compToUpdate = await CompositionsModel.findById(songId);
  if(!compToUpdate){
    res.send({success: false});
    return;
  }
  compToUpdate.set({compositionArray: compositionArray});
 const saveResult =  await compToUpdate.save();
 if(saveResult)
   res.send({success: true});
else
 res.send({success: false});
}


module.exports = {createNewComposition, getSongData, saveComposition,  getSongsByUsername}