import { useState, useEffect, useRef, useContext } from "react";
import "./Measure.css";
import { Piece, Note as NoteObj } from "../../../../Classes/PieceClass";
import { PieceContext } from "../../Composition";

export const Measure = (props) => {
  const [beats, setBeats] = useState(props.beatsArray);
  const [measureNumber, setMeasureNumber] = useState(props.measureNumber);



  useEffect(() => {
   if( beats && beats.length !== 0){
    return;
   }
   else{
    setBeats(props.beatsArray);
   
   }
  }, [props.beatsArray]);


  return (
    <div className="measure">
      {beats.map((beat, index) => {
        return (
          <Beat
            background={props.activeBeat == beat.beatId ? "isActive" : ""} 
            notesArray={beat.notesArray}
            key={index}
            beatNumber={beat.beatNumber}
            beatId={beat.beatId}
          />
        );
      })}
    </div>
  );
};

const Beat = (props) => {
  const [notesArray, setNotesArray] = useState(props.notesArray);

  useEffect(() =>{
    if(props.notesArray.length !== 0){
      return;
    }
    setNotesArray([...props.notesArray]);

  }, [props.notesArray])

  return (
    <div className="beat">
      {notesArray.map((note, index) => {
        return (
          <Note
            key={index}
            noteId={note.id}
            pitch={note.pitch}
            accidental={note.accidental}
            duration={note.duration}
            isRest={note.isRest}
            doesExist = {note.doesExist}
          />
        );
      })}
    </div>
  );
};

const Note = (props) => {
  let {pieceObject, setPieceObject} = useContext(PieceContext);
  const [doesExist, setDoesExist] = useState(props.doesExist);
  const [pitch, setPitch] = useState(props.pitch);
  const [noteobj, setNoteObj] = useState({});
  const [noteDuration, setNoteDuration] = useState(props.duration || "quarter");
  const [accidental, setAccidental] = useState(props.accidental);
  const [noteImgSrc, setNoteImgSrc] = useState(undefined);
  const [showEditOptions, setShowEditOptions] = useState(false);
  //update the image of the note any time the user changes the duration or the accidental
  useEffect(() => {

    if (!doesExist && pitch % 2 === 0) {
      setNoteImgSrc("/horizontalLine.png");
    } else if (doesExist) {
      let src = "/";
      if (accidental === "flat") src += "flat";
      else if (accidental === "sharp") src += "sharp";

      src += noteDuration;
      src += pitch % 2 === 0 ? "Line" : "Space";
      src += ".png";
      setNoteImgSrc(src);
    } else {
      setNoteImgSrc("/blankNote.jpg");
    }
  }, [noteDuration, accidental, doesExist]);

  const handleNoteDurationChange = (e) => {
   
    setNoteDuration(e.target.value);
  };

  const handleNoteAccidentalChange = (e) => {
    setAccidental(e.target.value);
  };

  const updateNote = (id, newNote, piece) => {
    //find which staff it's in
    const staffNum = Math.floor(id / (9 * piece.beatsPerMeasure * 4)); //9 notes per beat 4 measures in one staff
    //find out what measure of the staff it is in
    const measureNum = Math.floor((id - 9 * piece.beatsPerMeasure * 4 * staffNum) /(piece.beatsPerMeasure * 9));
    //find which beat in the measure it's in     
    const beatNum = Math.floor((id - staffNum*(9 * piece.beatsPerMeasure * 4) - measureNum*(piece.beatsPerMeasure*9)) / 9);
   
    //find the note to change
    const noteNum = newNote.pitch;
    console.log("staffNum: " +staffNum +" measureNum: " +measureNum +" beatNum: " +beatNum +" noteNum: " +noteNum);

    //update the note to the new note
    piece.staffsArray[staffNum].measuresArray[measureNum].beatsArray[beatNum].notesArray[noteNum] = { ...newNote };
    //update the state of the pieceObject
    setPieceObject({...piece});

  };

  const handleDelete = () =>{
    let src = "/";
    setNoteImgSrc(src);
    setDoesExist(false);
    setShowEditOptions(false); // Hide the popup after creating the note
    //update the piece object to reflect the new note
    updateNote(
      props.noteId,
      new NoteObj(pitch, props.noteId, noteDuration, false, "natural", false),
     pieceObject
    );
    //pitch, id, duration, isRest, accidental, doesExist
  }

  const handleCreateNote = () => {
    let src = "/";
    if (accidental === "flat") src += "flat";
    else if (accidental === "sharp") src += "sharp";
    
    src += noteDuration;
    src += Number(pitch) % 2 === 0 ? "Line" : "Space";
    src += ".png";
    setNoteImgSrc(src);
    setDoesExist(true);
    setShowEditOptions(false); // Hide the popup after creating the note
    //update the piece object to reflect the new note
    updateNote(
      props.noteId,
      new NoteObj(pitch, props.noteId, noteDuration, false, accidental, true),
     pieceObject
    );
    //pitch, id, duration, isRest, accidental, doesExist
  };

  const handleClick = () => {
    if (showEditOptions) {
      return;
    }
    // Toggle the visibility of the popup when the note is clicked
    setShowEditOptions((prevState) => !prevState);
  };

  return (
    <div
      onClick={handleClick}
      className="note"
    >
      <img src={noteImgSrc} alt="note" />

      <div
        className={`edit-note-options ${
          showEditOptions ? "visible" : "hidden"
        }`}
      >
        <select
          name="duration"
          value={noteDuration}
          onChange={handleNoteDurationChange}
        >
          <option value="sixteenth">1/16</option>
          <option value="firstEigth">first 1/8</option>
          <option value="secondEigth">second 1/8</option>
          <option value="secondEigthRest">second 1/8 with Rest</option>
          <option value="eigthsPair">1/8 pair</option>
          <option value="quarter">1/4</option>
          <option value="half">1/2</option>
          <option value="whole">whole</option>
        </select>
        <select
          name="accidental"
          value={accidental}
          onChange={handleNoteAccidentalChange}
        >
          <option value="sharp">Sharp</option>
          <option value="flat">Flat</option>
          <option value="natural">Natural</option>
        </select>
        <button onClick={handleDelete}>Delete</button>

        <button onClick={handleCreateNote}>Create Note</button>
        <button
          onClick={() => {
            setShowEditOptions((prevState) => !prevState);
          }}
        >
          X
        </button>
      </div>
    </div>
    
  );
};
