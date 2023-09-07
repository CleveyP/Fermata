const mongoose = require("mongoose");
const CompositionsModel = require("../Models/Compositions");

const createNewComposition = async (req, res) =>{
    //get the data about the new composition
    const songName = req.body.songName;
    const numBars = req.body.numberOfBars;
    const timeSig = req.body.timeSignature;
    const username = req.body.username;
    const compositionArray = req.body.compositionArray;
    //get the current date 
    const creationDate = new Date();
    const dateObject = {month: creationDate.getMonth(), year: creationDate.getFullYear(), day: creationDate.getDate()};
   const millis = Date.now();
  //make sure that the name of the composition does not exist for that user.
  let nameSearchResult = await CompositionsModel.findOne({author: username, title: songName});
  if(nameSearchResult){
    //there already exists a composition with that name by the same author
    res.send({success: false, message: "You already have a song named " + songName + ". You must name all songs uniquely."});
    return;
  }

    //generate new id for the song 
    //put the song in the CompositionModel in the db
    try {
        let newComposition = await CompositionsModel.create({
          title: songName,
          date: dateObject,
          millis: millis,
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
          compositionArray: songData.compositionArray,
          bpm: songData.bpm,

          trebleSynth: songData.trebleSynth,
          bassSynth: songData.bassSynth,
          trebleEffects: songData.trebleEffects,
          bassEffects: songData.bassEffects,
          trebleVolume: songData.trebleVolume,
          bassVolume: songData.bassVolume,

          trebleAtt: songData.trebleAtt,
          trebleRel: songData.trebleRel,
          trebleSus: songData.trebleSus,
          trebleMento: songData.trebleMento,
          bassAtt: songData.bassAtt,
          bassRel: songData.bassRel,
          bassSus: songData.bassSus,
          bassMento: songData.bassMento
        });
    }
    else{
        res.send({success:false});
    }
}

const getSongsByUsername = async (req, res) =>{
  //get the username from the req object
  const username = req.body.username;
  //get the compositions titles and songIds that were made by the username user

const authorQuery = { author: username }; 
const fieldsToInclude = "_id title date";

const result = await CompositionsModel.find(authorQuery, fieldsToInclude).sort({ millis: -1 }); //sort the songs based on creation date
  if (!result) {
    console.error("Error executing the query:");
    res.send({success: false});
  } else {
    res.send({success: true, songsList: result});
  }
}


const saveComposition = async (req, res) =>{
  //get the composition json array from req
  const compositionArray = req.body.composition;
  //get the songId from req
  const songId = req.body.songId;
 //get the current date 
 const creationDate = new Date();
 const dateObject = {month: creationDate.getMonth(), year: creationDate.getFullYear(), day: creationDate.getDate()};
 const millis = Date.now();

  //update the compositionModel's jsonArray where  _songId ==  songId 
  let compToUpdate = await CompositionsModel.findById(songId);
  if(!compToUpdate){
    res.send({success: false});
    return;
  }
  compToUpdate.set({compositionArray: compositionArray, date: dateObject, millis: millis});
  compToUpdate.set({
    bpm: req.body.bpm,
    trebleSynth: req.body.trebleSynth,
    bassSynth: req.body.bassSynth,
    trebleVolume: req.body.trebleVolume,
    bassVolume: req.body.bassVolume,
    trebleEffects: req.body.trebleEffects,
    bassEffects: req.body.bassEffects,

    trebleAtt: req.body.attRel.treble.att,
    trebleRel: req.body.attRel.treble.rel,
    trebleSus: req.body.attRel.treble.sus,
    trebleMento: req.body.attRel.treble.mento,
    bassAtt: req.body.attRel.bass.att,
    bassRel: req.body.attRel.bass.rel,
    bassSus: req.body.attRel.bass.sus,
    bassMento: req.body.attRel.bass.mento
  });
 const saveResult =  await compToUpdate.save();
 if(saveResult)
   res.send({success: true});
else
 res.send({success: false});
}


const deleteComposition = async (req, res) =>{
  //try to delete a composition document in the CompositionModel in mongodb
  const songId = req.body.songId;
  console.log("deleting the song with songId: " + songId);
  //try to delete the document that matches the song id in the composition model
  const deleteResult = await CompositionsModel.findByIdAndRemove({ _id: songId});
  if(deleteResult){
    res.send({success: true});
  }
  else{
    res.send({success: false});
  }
}

const updateTitle = async (req, res) =>{
  const songId = req.body.nameId;
  const newTitle = req.body.newName;
  const username = req.body.username;

  console.log("got new title: " + newTitle + " with song id " + songId);

  //make sure that the name of the composition does not exist for that user.
  let nameSearchResult = await CompositionsModel.findOne({author: username, title: newTitle});
  if(nameSearchResult){
    //there already exists a composition with that name by the same author
    res.send({success: false, errorMessage: "You already have a song named " + newTitle + ". You must name all songs uniquely."});
    return;
  }
  //get the composition document to be updated.
  let compToUpdate = await CompositionsModel.findById(songId);
  if(!compToUpdate){
    res.send({success: false, errorMessage: "could not locate the original composition"});
    return;
  }
  compToUpdate.set({title: newTitle});
  const saveResult =  await compToUpdate.save();
  if(saveResult)
   res.send({success: true});
 else
   res.send({success: false, errorMessage: "could not save the updated document"});

}


module.exports = {createNewComposition, getSongData, saveComposition,  getSongsByUsername, deleteComposition, updateTitle}