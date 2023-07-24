//a Piece class hold all Staffs
class Piece{
    staffsArray = [];
    constructor(numberOfBars, timeSig){
        //fill the staffs array
        if(Array.isArray(numberOfBars))
            this.staffsArray = [...staffsArray];
        else{
            //it is a new Piece object and it is completely empty
            //fill the staffs array with numberOfBars * 2 / 4 many staff objects

        }
        
    }
 
    setStaffs(staffsArray){
        this.staffsArray = [...staffsArray];
    }

}
//a Staff holds 4 measures and is either a bass or treble staff
class Staff{
    measuresArray = [];
    constructor(measuresArray, clef, timeSig){ //either measures array or number of beats
        //fill the staffs array
        if(Array.isArray(measuresArray))
            this.measuresArray = [...staffsArray];
        else{
            let numberOfBeats = timeSig / 10;
            //it is a new staff completely so fill it with four measure objects
            for(let i=1; i<= 4; i++){
                this.measuresArray.push(new Measure(numberOfBeats, i));
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
    
    beatsArray = [];
    constructor(numberOfBeats, measureNumber){
        if(Array.isArray(numberOfBeats)){
            this.beatsArray = [...numberOfBeats];
        }
        else{
            //this is a new measure so add numberOfBeats many beat objects to its array
            for(let i=1; i<=numberOfBeats; i++){
                this.beatsArray.push(new Beat(i))
            }
        }
        this.measureNumber=measureNumber;
    }
}

//a Beat holds 9 notes and these nine notes can be broken into sets of notes
class Beat{
    notesArray = [];
    constructor(beatNumber, notesArray){
        if(notesArray){
            this.notesArray = [...notesArray];
        }
        else{
            //this is a new beat and so
            //fill its array with 9 Note objects
            for(let i = 0; i< 9; i++){
                notesArray.push(new Note(i));
            }
        }
        this.beatNumber = beatNumber;
    }
}
//a Note has a duration, whether it is a rest or not, some pitch, some accidental, and it can either exist or not
class Note{

    constructor(pitch, duration, isRest, accidental, doesExist){
        if(doesExist != undefined){ //if user provides all arguments
            this.duration = duration;
            this.isRest = isRest;
            this.accidental = accidental;
            this.doesExist = doesExist;
            this.pitch = pitch;
        }

        else{
            //else this is a default note
            this.duration = 0;
            this.isRest = false;
            this.accidental = "natural";
            this.doesExist = false;
            this.pitch = pitch;
        }
    }

}