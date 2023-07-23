

const createNewComposition = async (req, res) =>{
    //get the data about the new composition
    const songName = req.body.songName;
    const numBars = req.body.numberOfBars;
    const timeSig = req.body.timeSignature;

    console.log(songName, numBars, timeSig);
    


//create a new document in the compositions mongo model
res.send({});
}



module.exports = {createNewComposition}