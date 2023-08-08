//helper functions for AI 

//@param beatId is the id of the treble beat NOT ever the bass beat id
//returns all the notes in a beat including both treble and bass chords as an object: {trebleChord: ['A'], bassChord: ['B', 'C'], totalChord: ['A', 'B', 'C']}
export const getChordByBeatId = (beatId, pieceObj) =>{
const timeSig = pieceObj.timeSig;
//create trebleChord, bassChord, totalChord
let trebleChord = [];
let bassChord = [];
let totalChord = [];

//looks at the beat(s) before the current beat to check for lingering whole, half notes, quarter notes etc.
//if the timeSig is 7/8 for example, we need to look back 7 beats in case there is a whole note 7 beats ago. 

const beatsPerMeasure = Math.floor(timeSig / 10);
const distanceBackward = beatsPerMeasure -1 ;
const startingIdTreble = (beatId - distanceBackward) > 0 ? (beatId - distanceBackward) : 0; 
const beatsInStaff = 4* Math.floor(timeSig / 10); //four measures in one staff. Each measure has the numerator of the time sig number of beats

for(let trebleId=startingIdTreble, bassId = startingIdTreble + beatsInStaff; trebleId <= beatId; trebleId++, bassId++){
let grandStaffBeatNum = 4 * beatsPerMeasure * 2;
if((trebleId % grandStaffBeatNum) > (grandStaffBeatNum/2 -1)){
    console.log("in here!")
     console.log("the beat is " + trebleId)
    //we are in the bass staff by accident
    if((trebleId % grandStaffBeatNum - grandStaffBeatNum/2) <= beatsPerMeasure){
        //we are in the first measure of the bass staff
        trebleId+= (grandStaffBeatNum / 2);
        beatId+= (grandStaffBeatNum / 2);
    }
    else{
        //we are in the last measure of the bass staff
        trebleId-= (grandStaffBeatNum/2);
        beatId-= (grandStaffBeatNum/2);
    }
}
//For the treble beat: 
//get the distance in beats between the current beat and the one in question
let durationRange = beatId - trebleId + .25;
//get the note array for the current beat out of the composition arg:

//find which staff to go into
let staffNum = Math.floor(trebleId / (4 * beatsPerMeasure * 2) );
console.log(staffNum)
//find which measure to go into
let measureNum = Math.floor( (trebleId - staffNum * (4 * beatsPerMeasure * 2)) / 4);
console.log(measureNum)
//find which beat to go into
let beatNum = ( trebleId % (4 * beatsPerMeasure * 2) ) % beatsPerMeasure;
console.log(beatNum)
//index into the composition arg object using the indices that we found above
let notesArray = pieceObj.staffsArray[staffNum * 2].measuresArray[measureNum].beatsArray[beatNum].notesArray;
//for every single note in the noteArray:

for(let note =0; note< notesArray.length; note++){
    
    //if the note duration is >= the durationRange then push it into the trebleChord
    let currentNote = notesArray[note];
     //if the note does not exist, then skip this iteration
     if((!currentNote.doesExist) || currentNote.duration==0)
         continue;
    let currentDuration = getNoteDurationFromString(currentNote.duration, timeSig);
    if(currentDuration >= durationRange){
        //this note is persisting into the beat that we are curious about
       let pitchLetter = getPitchNameFromNoteObj(currentNote, 'treble');
        trebleChord.push(pitchLetter);
        //also push it into the totalChord
        totalChord.push(pitchLetter);
    }
    
}
//For the bass beat:

//index into the composition arg object using the indices that we found above but offset the staffNum by one to go one staff below the treble staff
notesArray = pieceObj.staffsArray[staffNum * 2 + 1 ].measuresArray[measureNum].beatsArray[beatNum].notesArray;
//for every single note in the noteArray:
for(let note =0; note< notesArray.length; note++){
   
    //if the note duration is >= the durationRange then push it into the trebleChord
    let currentNote = notesArray[note];
     //if the note does not exist, then skip this iteration
     if((!currentNote.doesExist)){
        continue;
     }
    
        
    let currentDuration = getNoteDurationFromString(currentNote.duration, timeSig);
    console.log(currentDuration + " for note: " + currentNote)
    console.log(durationRange);
    if(currentDuration >= durationRange){
        //this note is persisting into the beat that we are curious about
       let pitchLetter = getPitchNameFromNoteObj(currentNote, 'bass');
        bassChord.push(pitchLetter);
        //also push it into the totalChord
        totalChord.push(pitchLetter);
    }
    
    }
 }
 console.log("the treble chord is: " + trebleChord.join(" ") )
 console.log("the bass chord is: " + bassChord.join(" ") )
 console.log("the total chord is: " + totalChord.join(" ") )
 return {totalChord: totalChord, bassChord: bassChord, trebleChord: trebleChord}
}

//returns an array of all notes in the passed in scale
const getAllDiatonicNotes = (keySignature) => {

}

const getNoteDurationFromString = (durationString, timeSig) =>{
   let durationNum;
   let whichGetsBeat = Math.floor(timeSig % 10); 
   let numBeatsPerMeasure = Math.floor(timeSig / 10);
   
   switch(durationString){
    case "whole":
        durationNum = (whichGetsBeat === 8) ? (numBeatsPerMeasure / 2) : numBeatsPerMeasure;
        break;
    case "dottedHalf":
        durationNum = 3;
        break;
    case "half":
        durationNum = 2;
        break;
    case "dottedQuarter": 
        durationNum = 1.5;
        break;
    case "quarter":
        durationNum = 1;
        break;
    case "firstEigth":
        durationNum = .5;
        break;
    case "eigthPair":
        durationNum = 1;
    case "secondEigth":
        durationNum = .5; //TODO: look into this case should it be a full beat?
        break;
    case "sixteenth":
      durationNum = .25;
        break;
    default: 
        durationNum = 0;
        console.log("something weird happened when getting note's duration." + durationString);
   }
   if(whichGetsBeat == 8){
    durationNum *=2;
   }
   return durationNum;
}

const getPitchNameFromNoteObj = (note, clef) => {
    let pitch = "";
    if(clef === 'bass'){
    switch (Number(note.pitch)) {
        case 0:
          pitch = "A";
          break;
        case 1:
          pitch = "G";
          break;
        case 2:
          pitch = "F";
          break;
        case 3:
          pitch = "E";
          break;
        case 4:
          pitch = "D";
          break;
        case 5:
          pitch = "C";
          break;
        case 6:
          pitch = "B";
          break;
        case 7:
          pitch = "A";
          break;
        case 8:
          pitch = "G";
          break;
        default:
          pitch = "A";
      }
    }
    else if(clef === "treble"){
        switch (Number(note.pitch)) {
            case 0:
              pitch = "F";
              break;
            case 1:
              pitch = "E";
              break;
            case 2:
              pitch = "D";
              break;
            case 3:
              pitch = "C";
              break;
            case 4:
              pitch = "B";
              break;
            case 5:
              pitch = "A";
              break;
            case 6:
              pitch = "G";
              break;
            case 7:
              pitch = "F";
              break;
            case 8:
              pitch = "E";
              break;
            default:
                pitch = "Z";
          }
    }
    else{
        console.log("cannot call getPitchNameFromNoteObj with second arg: " + clef);
        return "Z";
    }
      //add the accidental 
      let accidental = "";
      if(note.accidental === "flat"){
        accidental+= "b";
      }
      else if(note.accidental === "sharp"){
        accidental+= "#";
      }
      let res = pitch.slice(0, 1) + accidental + pitch.slice(1);
      return res;
}





