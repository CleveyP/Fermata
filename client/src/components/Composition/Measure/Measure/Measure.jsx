import { useState, useEffect } from "react";
import "./Measure.css";

export const Measure = (props) =>{
    const [beats, setBeats] = useState(props.beatsArr); //array of beat arrays-- a beat array is an array of 9 note objects. Either a note is a note or a rest


    useEffect( () =>{
        if(beats.length == 0){
            //populate the beats array with all nothings
            let newBeats = [];
            for(let i=0; i< props.numBeats; i++){
                //create the beat array
                let beat = [];
                for(let j=0; j< 9; j++){
                    //push a note object into the beat
                    beat.push({doesExist:false, duration:0, isRest: false, accidental: "natural", pitch: j});
                }
                newBeats.push(beat);
            }
            setBeats([...newBeats]);
        }
    }, [props.numBeats])



    return (
        <div className="measure ">
            {
                beats.map((beat, index) =>{
                    return <Beat noteArr={beat} key={index}/>
                })
            }
        </div>
    )


}

//a beat component that has 9 note components in it stacked on top of each other
const Beat = (props) =>{

    return (
        <div className = "beat">
            {
                props.noteArr.map((note, index) =>{
                    return <Note note={note}/>
                })
            }
        </div>
    )

}

const Note = (props) =>{
    let imgTag = undefined;
    if(!props.note.doesExist && props.note.pitch % 2 == 0){
        imgTag = <img src="/horizontalLine.png" alt="empty line"/>
    }
    else if(props.note.doesExist){
        //pick the image that matches the note duration
    }
    else{
      imgTag  = <img src="/blankNote.jpg" alt="empty line"/>
    }
     
    return (
        <div className={`note ${props.note.duration} ${props.note.isRest} ${props.note.doesExist} ${props.note.accidental}`}>
            {imgTag}
        </div>
    );
}