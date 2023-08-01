//a Piece class hold all Staffs
export class Piece{
   
    constructor(numberOfBars, timeSig){
        this.staffsArray = [];
        this.timeSig = timeSig;
        this.beatsPerMeasure = Math.floor(timeSig / 10); 
        //fill the staffs array
        if(Array.isArray(numberOfBars)){
            this.staffsArray = [...numberOfBars];
        }
        else{
            //it is a new Piece object and it is completely empty
            //fill the staffs array with numberOfBars * 2clefs / 4bars per clef many staff objects
            for(let i=0; i< Math.floor(numberOfBars*2 / 4); i++){
                this.staffsArray.push(new Staff(null, (i%2==0) ? "treble" : "bass", timeSig, i));
            }
        }
        
    }
 
    setStaffs(staffsArray){
        this.staffsArray = [...staffsArray];
    }
    //numNotes in beat = 9
    //numBeats in measure = numBeats
    //numMeasures in staff = 4

    //numNotes in One staff = 9*beatsPerMeasure*4    
    //numNotes in one Measure = BeatsPerMeasure  
    //id =  numNotesInOneStaff*(staffNum-1) + (measureNum-1)*numBeats*9 + 9*beatNum + pitch     46 staff 1 beat 2 pitch 2 measure 2
    updateNote(id, newNote, piece){
        //find which staff it's in
        const staffNum = Math.floor(id / (9*piece.beatsPerMeasure*4)); //9 notes per beat 4 measures in one staff
        //find out what measure it is in
        const measureNum = Math.floor((id -  (9*piece.beatsPerMeasure*4) * staffNum) / (piece.beatsPerMeasure*9));
        //find which beat it's in 
        const beatNum = (id%(9*piece.beatsPerMeasure)) % 9; 
        //find the note to change
        const noteNum = newNote.pitch;

        //update the note to the new note
        piece.staffsArray[staffNum].measuresArray[measureNum].beatsArray[beatNum].notesArray[noteNum] = {...newNote};
    }

    //noteNum = 

}
//a Staff holds 4 measures and is either a bass or treble staff
class Staff{
    
    constructor(measuresArray, clef, timeSig, staffNumber){ //either measures array or time sig and clef
        this.staffNumber = staffNumber;
        this.measuresArray = [];
        //fill the staffs array
        if(Array.isArray(measuresArray))
            this.measuresArray = [...measuresArray];
        else{
            let numberOfBeats = Math.floor(Number(timeSig) / 10);
            //it is a new staff completely so fill it with four measure objects
            for(let i=0; i< 4; i++){
                this.measuresArray.push(new Measure(numberOfBeats, staffNumber*4 +i));
            }
        }
        this.clef = clef;
        this.timeSig = timeSig;
    }
 
    setStaffs(measuresArray){
        this.measuresArray = [...measuresArray];
    }


}

//a Measure holds some number of beats
class Measure{

    
    constructor(numberOfBeats, measureNumber){
        this.beatsArray = [];
        if(Array.isArray(numberOfBeats)){
           
            this.beatsArray = [...numberOfBeats];
        }
        else{
           
            //this is a new measure so add numberOfBeats many beat objects to its array
            for(let i=0; i<numberOfBeats; i++){
                this.beatsArray.push(new Beat(i, null, measureNumber*numberOfBeats+i))
            }
          //  console.log(beatsArray.join(" "));
        }
        this.measureNumber=measureNumber;
    }
}

//a Beat holds 9 notes and these nine notes can be broken into sets of notes
class Beat{
  
    constructor(beatNumber, notesArray, beatId){
        this.beatId = beatId;
        this.notesArray = [];
        if(notesArray){
            this.notesArray = [...notesArray];
        }
        else{
            //this is a new beat and so
            //fill its array with 9 Note objects
            for(let i = 0; i< 9; i++){
                this.notesArray.push(new Note(i, beatId*9 + i));
            }
        }
        this.beatNumber = beatNumber;
    }
}
//a Note has a duration, whether it is a rest or not, some pitch, some accidental, and it can either exist or not
export class Note{

    constructor(pitch, id, duration, isRest, accidental, doesExist){
        if(doesExist){ //if user provides all arguments
            this.duration = duration;
            this.isRest = isRest;
            this.accidental = accidental;
            this.doesExist = doesExist;
            this.pitch = pitch;
            this.id = id;
        }

        else{
            //else this is a default note
            this.duration = 0;
            this.isRest = false;
            this.accidental = "natural";
            this.doesExist = false;
            this.pitch = pitch;
            this.id = id;
        }
    }

}