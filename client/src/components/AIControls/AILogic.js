//helper functions for AI 


import { chordsAndScales, chordQualities, deepCopyArray } from "./chordsAndScales";


const NUMBER_OF_NOTES_IN_STAFF = 9;
const  NO_CHORD_PENALTY = -5;
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

//find which measure to go into
let measureNum = Math.floor( (trebleId - staffNum * (4 * beatsPerMeasure * 2)) / beatsPerMeasure);

//find which beat to go into
let beatNum = ( trebleId % (4 * beatsPerMeasure * 2) ) % beatsPerMeasure;

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
    return deepCopyArray(chordsAndScales.scales.get(keySignature));
}
const getAllDiatonicChords = (keySignature) =>{
  return deepCopyArray(chordsAndScales.chords.get(keySignature))
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

//@param notes is an array of capital letter chars. KeySignature is a string that is the name of a major key signature.
//returns a list of all possible chords that could be created from notes
//returns an empty array if no chords are possible. Returns an array of every diatonic note if the notes array arg is empty
export const getPossibleChords = (notes, keySignature) =>{
    if(notes.length == 0){
        return  chordsAndScales.chords.get(keySignature);
    }
    //find out if there is a non diatonic note in the notes array.
    const diatonicNotes = getAllDiatonicNotes(keySignature);
    //filter out the nondiatonic notes and then work from there 
     notes.filter( (note) =>{
        return diatonicNotes.includes(note);
    });
    if(notes.length == 0){
        //there are no diatonic notes in the current beat. Therefore, we cannot hazard a guess at what the chord should be
        //so return all chords that are possible
        //TODO: make sure that there isn't just a sharp note in there that might be a secondary dominant chord
        return [];
    }
    //get the list of all diatonic chords from the keySignature
   let chordList =  getAllDiatonicChords(keySignature);
   //For every note in notes, look through each chord in chordList. If the current note is not contained in the current chord, then delete that chord 
   //from the chord list
   for(let note =0; note< notes.length; note++){
    let currNote = notes[note];
        for(let i=0; i< chordList.length; i++){
            if(!chordList[i].includes(currNote)){
                chordList.splice(i, 1);
                i--;
            }
        }
   } 
   if(chordList.length == 0){
    //there is a maj or min interval in the notes....
   let  isMajSecond;
    chordList = getAllDiatonicChords(keySignature);
   
   // get rid of the duplicates in the notes array
   let freq = new Map();
   let numUnique = 0;
   for(let i =0; i< notes.length; i++){
    if(!freq.has(notes[i])){
        numUnique++;
        freq.set(notes[i], 0);
    }
    freq.set(notes[i], freq.get(notes[i])+1);
   }
    //if the length of unique notes is 2  
    if(numUnique == 2){
       //then find out if we can create a sus chord.
       //if the index between the two notes is a major second then we can create a sus chord
       const uniqueNotes = Array.from(freq.keys());
       let index0;
       let index1;
       for(let j=0; j<diatonicNotes.length; j++){
        if(uniqueNotes[0] == diatonicNotes[j]){
            index0 = j;
        }
        if(uniqueNotes[1] == diatonicNotes[j]){
            index1 = j;
        }
       }
       if( (index0 == 6 && index1 == 0) || (index0 == 0 && index1 == 6)){
         isMajSecond = false;
       }
       else if( (index0 == 2 && index1 == 3) || (index0 == 3 && index1 == 2)){
        isMajSecond = false;
      }
      else{
        isMajSecond = true;
      }
      
      if(isMajSecond){
        //suggest the sus four
        let susFour = [];
        susFour.push(uniqueNotes[0]);
        susFour.push(uniqueNotes[1]);
        //find the perfect fifth to complete the sus chord.
        if(index0 === 0 || index1 === 0){
            susFour.push(diatonicNotes[4]);
        }
        else if(index0 === 1 || index1 === 1){
            susFour.push(diatonicNotes[5]);
        }
        else if((index0 === 3 && index1 === 4) && (index0 === 4 && index1 === 3)){
            susFour.push(diatonicNotes[0]);
        }
        else if((index0 === 4 && index1 === 5) && (index0 === 5 && index1 === 4)){
            susFour.push(diatonicNotes[1]);
        }
        else if((index0 === 5 && index1 === 6) && (index0 === 6 && index1 === 5)){
            susFour.push(diatonicNotes[2]);
        }
        let res = [];
        res.push(susFour);
        // TODO: or a dominant 7 chord
        return res;
      }

         
       
    }

    //num unique notes is greater than 2... 
    
   }

   return chordList;
   //return the chord list
}
//
const getChordsNames = (notes, keySignature) =>{
  let possibleChords = getPossibleChords(notes, keySignature);
  console.log("the possible chords found are " + possibleChords.join(" "));
  //find the index of each chord in the chords list
  let diatonicChords = getAllDiatonicChords(keySignature);
  let roots = getAllDiatonicNotes(keySignature);
  let results = [];
  //loop through the possible chords array and match the index that they occur at to the 
  for(let i = 0; i< possibleChords.length; i++){
    for(let j =0; j< diatonicChords.length; j++){
      console.log(diatonicChords[j]);
      console.log(possibleChords[i]);
      if(possibleChords[i].every(element => diatonicChords[j].includes(element))){
       
        let chordName = roots[j] + " " + chordQualities[j];
        results.push(chordName);
       // possibleChords.splice(i, 1);
        break;
      }
    }
  }
  //TODO:
  //if there still remain some  chords in the array, figure out how to name them as well

  return results;
}



//given a beat id and composition and staff, returns an array of all possible notes that could be placed and their corresponding values
//the array is sorted by value in descending order.  
const getNoteWeights = (beatId, pieceObj, staff, keySignature ) =>{
    let diatonicNotes = getAllDiatonicNotes(keySignature);
    let notesWeights = [];
    //get the chord that already exists in that beat
    const chordObj  = getChordByBeatId(beatId, pieceObj);
   let trebleNotes = [...chordObj.trebleChord];
   let bassNotes = [...chordObj.bassChord];
   let totalNotes = [...chordObj.totalChord];
   let staffNotes = (staff === "treble") ? trebleNotes : bassNotes;
   
         //if the beat that the user wants a note placed in already has two notes
        if(staffNotes.length > 1){
            console.log("cannot put another note in that beat since it already has 2 notes in the " + staff + " part of the beat");
            return notesWeights;
        }   
            //place a diatonic note in every possible location that does not already have a note in it and calculate these note values
            for(let note = 0; note < diatonicNotes.length; note++){
                if( !staffNotes.includes(diatonicNotes[note]) ){
                    let value=0;
                    //place the note in the beat
                    totalNotes.push(diatonicNotes[note]);
                    //increase the placement's value by the number of chords that it could potentially create
                    let possibleChords = getPossibleChords(totalNotes, keySignature);
                    if(possibleChords.length === 0){
                        value += NO_CHORD_PENALTY;
                    }
                    else{
                        value += possibleChords.length;
                    }
                    //check voice leading from previous bars as well

                    //store the note and value
                    notesWeights.push({note: diatonicNotes[note], weight: value});
                    //remove it from the array
                    let totalNotes = [...chordObj.totalChord];
                }
            }
            //sort the notesWeigts by weight in descending order
        notesWeights.sort((a, b) => {return a.weight - b.weight}).reverse();
        return notesWeights;
}

export const analyzeBeat = (beatId, pieceObject, keySignature, consoleHistory, setConsoleHistory) =>{
  console.log(JSON.stringify(pieceObject))
  //get all the notes in the beat 
  console.log("selected beat: " + beatId)
  let allNotesMessage = `The notes in beat ${beatId} are: `;
  const allNotesArray = getChordByBeatId(beatId, pieceObject).totalChord;
  allNotesMessage += allNotesArray.join(", ") + "\n";

  //get all the possible chords
  let possibleChords = "The possible chords for this beat are: ";
  //get the possible chords
  const chordList = getChordsNames(allNotesArray, keySignature);
  possibleChords += chordList.join(", ");

  // and display them to the console
 setConsoleHistory([...consoleHistory, allNotesMessage, possibleChords]);

}





