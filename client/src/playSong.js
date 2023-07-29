import * as Tone from "tone";

//create an array of notes to be played out of the composition array
export const getNotesArrays = (composition, bpm) => {
    //calculate the speed in seconds of each beat
    //bpm = numberOfbeats/ 60s 
    //one beat takes 60/bpm seconds 
    const beatTime = (60 / bpm );
    console.log(beatTime);
    console.log(bpm);

  //loop through the composition, staff by staff creating a bass array and a treble array
  //where each element in the array is an array of pitchDuration objects
  const trebleChordsArray = []; //[{startTime: , value: [ {pitch: 'C4' , duration: fr1} ]}, {startTime: , value: [ {pitch: , duration: } ]} ]
  const bassChordsArray = [];

  const trebleStaffs = [];
  const bassStaffs = [];
  for (let i = 0; i < composition.staffsArray.length; i++) {
    if (i % 2 == 0) {
      trebleStaffs.push(composition.staffsArray[i]);
    } else {
      bassStaffs.push(composition.staffsArray[i]);
    }
  }
  //loop through the treble staffs and bass staffs arrays beat by beat
  for (let staff = 0; staff < trebleStaffs.length; staff++) {
    for (let measure = 0; measure < trebleStaffs[staff].measuresArray.length; measure++) {
      for (let beat = 0; beat < trebleStaffs[staff].measuresArray[measure].beatsArray.length; beat++) {
        //filter out the notes in the current beat if they do not exist
        let filteredBeat = trebleStaffs[staff].measuresArray[
            measure
        ].beatsArray[beat].notesArray.filter((note) => {
          return note.doesExist;
        });

        //map the filtered beat array from pitch number to something like C2
        // and map the duration from a string to 1 for "whole" note .5 for "half"  etc
        let chord = filteredBeat.map((note) => {
            let pitchDuration = {};
          switch (Number(note.pitch)) {
            case 0:
              pitchDuration.pitch = "F5";
              break;
            case 1:
              pitchDuration.pitch = "E5";
              break;
            case 2:
              pitchDuration.pitch = "D5";
              break;
            case 3:
              pitchDuration.pitch = "C5";
              break;
            case 4:
              pitchDuration.pitch = "B5";
              break;
            case 5:
              pitchDuration.pitch = "A5";
              break;
            case 6:
              pitchDuration.pitch = "G4";
              break;
            case 7:
              pitchDuration.pitch = "F4";
              break;
            case 8:
              pitchDuration.pitch = "E4";
              break;
            default:
                pitchDuration.pitch = "A0";
          }
          //add the accidental 
          let accidental = "";
          if(note.accidental === "flat"){
            accidental+= "b";
          }
          else if(note.accidental === "sharp"){
            accidental+= "#";
          }
          pitchDuration.pitch = pitchDuration.pitch.slice(0, 1) + accidental + pitchDuration.pitch.slice(1);
          console.log("pitch found for note : " + note.pitch + " is: " + pitchDuration.pitch );
          //get the durations of each note object and convert them to fractions of 1 where 1 is a whole measure
          console.log(note.duration);
          switch(note.duration){
            case "whole":
                pitchDuration.duration = beatTime* (composition.timeSig % 10);
                pitchDuration.startTime = 0;
                break;
            case "dottedHalf":
                pitchDuration.duration = 2.5 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "half":
                pitchDuration.duration = 2 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "dottedQuarter": 
                pitchDuration.duration = 1.5 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "quarter":
                pitchDuration.duration = beatTime;
                pitchDuration.startTime = 0;
                break;
            case "firstEigth":
                pitchDuration.duration = .5 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "eigthPair":
                //turn this into a firstEigth and secondEigth of same pitch
                pitchDuration.startTime = 0;
            case "secondEigth":
                pitchDuration.duration = .5 * beatTime;
                pitchDuration.startTime = .5 * beatTime;
                break;
            case "sixteenth":
                pitchDuration.duration = .25 * beatTime;
                pitchDuration.startTime = 0;
                break;
            default: 
                pitchDuration.duration = 0;
                pitchDuration.startTime = 0;
                console.log("something weird happened when getting note's duration.");
          }
          //the pitchDuration object is complete at this point. 
          console.log(pitchDuration.duration);
          return pitchDuration;
        });
          //push pitchDurations chord into the array of treble notes to play
          trebleChordsArray.push(chord);
      }
    }
  }

   //loop through the bass staffs and bass staffs arrays beat by beat
   for (let staff = 0; staff < bassStaffs.length; staff++) {
    for (let measure = 0; measure < bassStaffs[staff].measuresArray.length; measure++) {
      for (let beat = 0; beat < bassStaffs[staff].measuresArray[measure].beatsArray.length; beat++) {
        //filter out the notes in the current beat if they do not exist
        let filteredBeat = bassStaffs[staff].measuresArray[
            measure
        ].beatsArray[beat].notesArray.filter((note) => {
          return note.doesExist;
        });

        //map the filtered beat array from pitch number to something like C2
        // and map the duration from a string to 1 for "whole" note .5 for "half"  etc
        let chord = filteredBeat.map((note) => {
            let pitchDuration = {};
          switch (Number(note.pitch)) {
            case 0:
              pitchDuration.pitch = "A4";
              break;
            case 1:
              pitchDuration.pitch = "G3";
              break;
            case 2:
              pitchDuration.pitch = "F3";
              break;
            case 3:
              pitchDuration.pitch = "E3";
              break;
            case 4:
              pitchDuration.pitch = "D3";
              break;
            case 5:
              pitchDuration.pitch = "C3";
              break;
            case 6:
              pitchDuration.pitch = "B3";
              break;
            case 7:
              pitchDuration.pitch = "A2";
              break;
            case 8:
              pitchDuration.pitch = "G2";
              break;
            default:
                pitchDuration.pitch = "A0";
          }
          //add the accidental 
          let accidental = "";
          if(note.accidental === "flat"){
            accidental+= "b";
          }
          else if(note.accidental === "sharp"){
            accidental+= "#";
          }
          pitchDuration.pitch = pitchDuration.pitch.slice(0, 1) + accidental + pitchDuration.pitch.slice(1);
          console.log("pitch found for note : " + note.pitch + " is: " + pitchDuration.pitch );
          //get the durations of each note object and convert them to fractions of 1 where 1 is a whole measure
          console.log(note.duration);
          switch(note.duration){
            case "whole":
                pitchDuration.duration = beatTime* (composition.timeSig % 10);
                pitchDuration.startTime = 0;
                break;
            case "dottedHalf":
                pitchDuration.duration = 2.5 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "half":
                pitchDuration.duration = 2 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "dottedQuarter": 
                pitchDuration.duration = 1.5 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "quarter":
                pitchDuration.duration = beatTime;
                pitchDuration.startTime = 0;
                break;
            case "firstEigth":
                pitchDuration.duration = .5 * beatTime;
                pitchDuration.startTime = 0;
                break;
            case "eigthPair":
                //turn this into a firstEigth and secondEigth of same pitch
                pitchDuration.startTime = 0;
            case "secondEigth":
                pitchDuration.duration = .5 * beatTime;
                pitchDuration.startTime = .5 * beatTime;
                break;
            case "sixteenth":
                pitchDuration.duration = .25 * beatTime;
                pitchDuration.startTime = 0;
                break;
            default: 
                pitchDuration.duration = 0;
                pitchDuration.startTime = 0;
                console.log("something weird happened when getting note's duration.");
          }
          //the pitchDuration object is complete at this point. 
          console.log(pitchDuration.duration);
          return pitchDuration;
        });
          //push pitchDurations chord into the array of treble notes to play
          bassChordsArray.push(chord);
      }
    }
  }

  let ret = [];
  ret.push(trebleChordsArray);
  ret.push(bassChordsArray);
  return ret;
};

//take in the trebleChords and bassChords and play these chords in order
export const playSong = (composition, bpm, trebleSynth, bassSynth) => {
    const beatTime = (60 / bpm );
    const res = getNotesArrays(composition, bpm);
    const trebleArray = res[0];
    const bassArray = res[1];


    let treblePoly;
    let bassPoly;
    //create two poly synths capable of playing multiple notes at the same time and mount them to the client's speakers 
    //the type of synth depends on the 3rd and 4th args
    switch(trebleSynth){
        case "FM":
            treblePoly = new Tone.PolySynth( Tone.FMSynth).toDestination();
            break;
        case "AM":
            treblePoly = new Tone.PolySynth( Tone.AMSynth).toDestination();
            break;
        case "SYNTH":
            treblePoly = new Tone.PolySynth( Tone.Synth).toDestination();
            break;
    }
    switch(bassSynth){
        case "FM":
            bassPoly = new Tone.PolySynth( Tone.FMSynth).toDestination();
            break;
        case "AM":
            bassPoly = new Tone.PolySynth( Tone.AMSynth).toDestination();
            break;
        case "SYNTH":
            bassPoly = new Tone.PolySynth( Tone.Synth).toDestination();
            break;
    }

  
    //loop through the treble array and for each beat (chord) that contains notes, trigger every note in the chord with its pitch duration and startTime
    //offset that is the offset from the start of the beat
   
    //get the current time as our start time to offset from.
    const now = Tone.now()

    //play every chord with an offset from start time of what number chord is current Ex: now +  3rdchord (chord == 2) = now + 2 beats.
    for(let chord = 0; chord < trebleArray.length; chord++){
        //trigger each note in the chord at its start time offset + now + chord
        for(let note = 0; note < trebleArray[chord].length; note++){
            treblePoly.triggerAttackRelease(trebleArray[chord][note].pitch, trebleArray[chord][note].duration, trebleArray[chord][note].startTime + now + chord*beatTime);
        }
       // do the same for the bass notes
        for(let note = 0; note < bassArray[chord].length; note++){
            bassPoly.triggerAttackRelease(bassArray[chord][note].pitch, bassArray[chord][note].duration, bassArray[chord][note].startTime + now + chord*beatTime);
        }
    }
}



