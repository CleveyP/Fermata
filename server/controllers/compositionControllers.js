const mongoose = require("mongoose");
const CompositionsModel = require("../Models/Compositions");
const ObjectId = mongoose.Types.ObjectId;

const createNewComposition = async (req, res) =>{
    //get the data about the new composition
    const songName = req.body.songName;
    const numBars = req.body.numberOfBars;
    const timeSig = req.body.timeSignature;
    const username = req.body.username;
    console.log(songName, numBars, timeSig);
    //generate new id for the song 
    //put the song in the CompositionModel in the db
    try {
        let newComposition = await CompositionsModel.create({
          title: songName,
          numBars: numBars,
          timeSignature: timeSig,
          author: username 
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
    console.log("songData:", songData);
    if(songData){
        res.send({success: true, songTitle: songData.title, numBars: songData.numBars, timeSig: songData.timeSignature });
    }
    else{
        res.send({success:false});
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
  await compToUpdate.save();
}


module.exports = {createNewComposition, getSongData, saveComposition}