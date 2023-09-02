import * as Tone from "tone";



let currentChordIndex = 0;
let scheduledEvents = [];
let now = 0;
let beginning =0;
let treblePoly;
let bassPoly;

//create an array of notes to be played out of the composition array
export const getNotesArrays = (composition, bpm) => {
    //calculate the speed in seconds of each beat
    //bpm = numberOfbeats/ 60s 
    //one beat takes 60/bpm seconds 
    const beatTime = (60 / bpm );
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
        ].beatsArray[beat].notesArray.filter((note) => { //TODO
          return note.doesExist;
        });

        //map the filtered beat array from pitch number to something like C2
        // and map the duration from a string to 1 for "whole" note .5 for "half"  etc
        let chord = (filteredBeat.length === 0) ? [{pitch: "", duration: beatTime}] :  filteredBeat.map((note) => {
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
              pitchDuration.pitch = "B4";
              break;
            case 5:
              pitchDuration.pitch = "A4";
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
          //get the durations of each note object and convert them to fractions of 1 where 1 is a whole measure
          switch(note.duration){
            case "whole":
                pitchDuration.duration = beatTime* Math.floor(Number(composition.timeSig) / 10);
                console.log(composition.timeSig)
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
              pitchDuration.pitch = "A3";
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
              pitchDuration.pitch = "B2";
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
          // console.log("pitch found for note : " + note.pitch + " is: " + pitchDuration.pitch );
          //get the durations of each note object and convert them to fractions of one beat where beatTime is the time in seconds for one beat
          switch(note.duration){
            case "whole":
                pitchDuration.duration = beatTime* Math.floor(Number(composition.timeSig) / 10); //whole note plays for whole duration of measure
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
          return pitchDuration;
        });
          //push pitchDurations chord into the array of bass chords to play
          bassChordsArray.push(chord);
      }
    }
  }

  let ret = [];
  //return the treble chords and bass chords arrays
  ret.push(trebleChordsArray);
  ret.push(bassChordsArray);
  return ret;
};


   //resolves to a sample synth that sounds like the instrument named @param instrument. Look at the Tone.js documentation for Tone.Sample to see its methods. 
  //for most purposes, this sample is interchangeable with a Tone.PolySynth object.
  async function createSampler(instrument) {
	console.log("inside createSampler" + instrument.substring(7));
    return new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: {
          G1: `../../${instrument.substring(7)}G1.mp3`,
          G2: `../../${instrument.substring(7)}G2.mp3`,
          C5: `../../${instrument.substring(7)}C5.mp3`,
          E4: `../../${instrument.substring(7)}E4.mp3`
        },
        onload: () => {
          // Resolve with the PolySynth
	console.log("successfully loaded!");
          resolve(sampler);
        },
onerror: (error) => {
    console.error("Error loading samples:", error);
    reject(error); // Reject the promise on error
  },


      });
    });
  }


//take in teh composition and apply the tempo, syths and effects. Play the composition.
export const playSong = async (composition, bpm, trebleSynth, bassSynth, effectsArrays, eq, setActiveBeat, attRelObj) => {
    //if the trebleSynth or bassSynth are samples then:
    let trebleSample;
    let bassSample;
    
    if(trebleSynth.substring(0, 6) === "SAMPLE"){
      //load the grand piano
      try{
	console.log("trying to load sample");
        trebleSample =  await createSampler(trebleSynth);
        trebleSample.release = attRelObj.treble.rel;
        trebleSample.attack=attRelObj.treble.att;
        trebleSample.toDestination();
      }
      catch (error) {
        console.error("Error in createPolySynth:", error);
      }
    }

    if(bassSynth.substring(0, 6) === "SAMPLE"){
      //load the grand piano
      try{
      bassSample =  await createSampler(bassSynth);
      bassSample.release = attRelObj.bass.rel;
      bassSample.attack=attRelObj.bass.att;
      bassSample.toDestination();
      }
      catch (error) {
        console.error("Error in createPolySynth:", error);
      }
    }


    //if the audioContext is suspended, then restart it. 
    if(Tone.context.state !== "running")
      Tone.start();

    const beatTime = (60 / bpm ); //get the time in seconds of one beat
    const res = getNotesArrays(composition, bpm);  // [[note 1 note 2 note 3], [note 2 note 3], ],  [[note 1 note 2 note 3], [note 2 note 3], ]
    const trebleArray = res[0];
    const bassArray = res[1];
    let numBeatsInStaff = 4 * Math.floor(composition.timeSig / 10);
    //get the effects on the treble that the user picks
    let trebleEffects = [];
    let bassEffects = [];
    //get all the effects for treble out of the effects array and put them in the treble array
    for(let i =0; i< effectsArrays[0].length; i++){
        //create the effect object
        let effect;
        switch(effectsArrays[0][i]){
            case "distortion":
                effect = new Tone.Distortion(0.5).toDestination();
                break;
            case "feedbackDelay":
                effect = new Tone.FeedbackDelay("16n", 0.5).toDestination();
                break;
            case "chorus":
                effect  = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
                break;
            case "LFO":
                effect = new Tone.AutoFilter("8n").toDestination().start();
                break;
            case "bitCrusher":
                effect = new Tone.BitCrusher(4).toDestination();
        }
        trebleEffects.push(effect);
    }
     //get all the effects for bass out of the effects array and put them in the effects array
     for(let i =0; i< effectsArrays[1].length; i++){
        //create the effect object
        let effect;
        switch(effectsArrays[1][i]){
            case "distortion":
                effect = new Tone.Distortion(0.5).toDestination();
                break;
            case "feedbackDelay":
                effect = new Tone.FeedbackDelay("16n", 0.5).toDestination();
                break;
            case "chorus":
                effect  = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
                break;
            case "LFO":
                effect = new Tone.AutoFilter("8n").toDestination().start();
                break;
            case "bitCrusher":
                effect = new Tone.BitCrusher(4).toDestination();
        }
        bassEffects.push(effect);
    }
   
    //free previous polysynths as they are a source of memory leak for the audioContext's audio nodes
    if(treblePoly && (!treblePoly.disposed)){
      console.log("disposing resources")
      treblePoly.dispose();
    }
    if(bassPoly && (!bassPoly.disposed)){
      bassPoly.dispose();
    }

    //create two poly synths capable of playing multiple notes at the same time and mount them to the client's speakers 
    //the type of synth depends on the 3rd and 4th args to playSong function
    switch(trebleSynth){
        case "FM":
        treblePoly = new Tone.PolySynth(Tone.FMSynth).toDestination();
            break;
        case "AM":
          treblePoly = new Tone.PolySynth(Tone.AMSynth).toDestination();
            break;
        case "SYNTH":
            treblePoly = new Tone.PolySynth(Tone.Synth).toDestination();
            break;
        case "MONO":
          treblePoly = new Tone.PolySynth(Tone.MonoSynth).toDestination();
            break;
        case "DUO":
          treblePoly = new Tone.PolySynth(Tone.DuoSynth).toDestination();
            break;
        case "SAMPLE_GRAND":
        case "SAMPLE_BASS":
        case "SAMPLE_EP":
        case "SAMPLE_SAX":
          treblePoly = trebleSample;
          break;
    }
    if((trebleSynth.substring(0, 6) !== "SAMPLE")){
      console.log(" the substring is " + trebleSynth.substring(0,6));
      //apply the attack release sustain that the user set to the treble synth
      treblePoly.options.envelope.attack = Number(attRelObj.treble.att);
      treblePoly.options.envelope.release = attRelObj.treble.rel;
      treblePoly.options.envelope.sustain = attRelObj.treble.sus;
      treblePoly.options.portamento = Number(attRelObj.treble.mento);
    }
    switch(bassSynth){
        case "FM":
          bassPoly = new Tone.PolySynth(Tone.FMSynth).toDestination();
            break;
        case "AM":
          bassPoly = new Tone.PolySynth(Tone.AMSynth).toDestination();
            break;
        case "SYNTH":
         
          bassPoly = new Tone.PolySynth(Tone.Synth).toDestination();
            break;
        case "MONO":
         
          bassPoly = new Tone.PolySynth(Tone.MonoSynth).toDestination();
            break;
        case "DUO":
          bassPoly = new Tone.PolySynth( Tone.DuoSynth).toDestination();
              break;
                case "SAMPLE_GRAND":
                case "SAMPLE_BASS":
                case "SAMPLE_EP":
                case "SAMPLE_SAX":
              bassPoly = bassSample;
              break;
    }
    //apply the attack release sustain that the user set to the treble synth
    if((bassSynth.substring(0, 6) !== "SAMPLE")){
      console.log(" the substring is " + bassSynth.substring(0,6));
    bassPoly.options.envelope.attack = Number(attRelObj.bass.att);
    bassPoly.options.envelope.release = attRelObj.bass.rel;
    bassPoly.options.envelope.sustain = attRelObj.bass.sus;
    bassPoly.options.portamento = Number(attRelObj.bass.mento);
    }
   // apply the equalizer to the synths
    treblePoly.volume.value = eq[0];
    bassPoly.volume.value = eq[1];

    //apply the effects to the synths
    for(let effect=0; effect< trebleEffects.length; effect++){
        treblePoly.connect(trebleEffects[effect]);
    }
    for(let effect=0; effect< bassEffects.length; effect++){
        bassPoly.connect(bassEffects[effect]);
    }

    //let each synth be able to play 9 notes simultaniously
    treblePoly.maxPolyphony = 15;
    bassPoly.maxPolyphony = 15;

  
    //loop through the treble array and for each beat (chord) that contains notes, trigger every note in the chord with its pitch duration and startTime
    //offset that is the offset from the start of the beat
    let wasPaused = Tone.Transport.state === 'paused';
   
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start();
    }
    
    //clear the events from a past tense playing of the song
    scheduledEvents.forEach((event) => Tone.Transport.clear(event));
    scheduledEvents = [];

    Tone.Destination.mute = false;
    //get the current time as our start time to offset from.
    // now = Tone.now() - beginning;
    now = Tone.now();
    //  if(beginning===0 ){
    //   beginning = now;
    //  }
     
    

    //if we have played through the whole song, start at the beginning. 
    currentChordIndex =  (currentChordIndex >= trebleArray.length) ? 0 : currentChordIndex;
    //play every chord with an offset from start time of what number chord is current Ex: now +  3rdchord (chord == 2) = now + 2 beats.
    for(let chord = currentChordIndex; chord < trebleArray.length; chord++){
        //trigger each note in the chord at its start time offset + now + chord
        for(let note = 0; note < trebleArray[chord].length; note++){
           const event =  Tone.Transport.schedule((time) => {
            //play the current note in the chord and
            treblePoly.triggerAttackRelease(trebleArray[chord][note].pitch, trebleArray[chord][note].duration, time);
              //and also update the active beat in the UI
              let grandStaffNum = Math.floor(chord / numBeatsInStaff);
              let activeChord = chord + grandStaffNum * numBeatsInStaff;
              setActiveBeat(activeChord);
            },
            Tone.Time(trebleArray[chord][note].startTime + now + (chord - currentChordIndex) * beatTime).toSeconds()
            
            );
           scheduledEvents.push(event);
        }

       // do the same for the bass notes
        for(let note = 0; note < bassArray[chord].length; note++){
          const event = Tone.Transport.schedule(
            (time) =>{
             bassPoly.triggerAttackRelease(bassArray[chord][note].pitch, bassArray[chord][note].duration, time);
            }, 
            Tone.Time(bassArray[chord][note].startTime + now + (chord - currentChordIndex) * beatTime).toSeconds()
          )
          scheduledEvents.push(event);
        }
  }

  if(wasPaused){
    currentChordIndex = 0;
  }
  
}




export const pauseSong = (bpm) =>{
 
  const beatTime = 60 / Number(bpm);
  
   if(Tone.Transport.state !== 'started'){
    console.log("the transport is not started!!!!");
    return;
   }
   Tone.Destination.mute = true;
   const elapsedTime = Tone.now() - now;
   scheduledEvents.forEach((event) => Tone.Transport.clear(event));
   scheduledEvents = [];
   // Store the current chord index so we can resume from this point
   currentChordIndex += Math.floor(elapsedTime / beatTime);  
}

export const toBeginning = (bpm, setActiveBeat) =>{
  setActiveBeat(0);
  pauseSong(bpm);
  currentChordIndex = 0;
}



