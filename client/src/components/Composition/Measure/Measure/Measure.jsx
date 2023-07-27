import { useState, useEffect, useRef, useContext } from "react";
import "./Measure.css";
import { Piece, Note as NoteObj } from "../../../../Classes/PieceClass";
import { PieceContext } from "../../Composition";

export const Measure = (props) => {
  const [beats, setBeats] = useState([]);
  const [measureNumber, setMeasureNumber] = useState(0);
  // useEffect(() => {
  //   if (beats.length === 0) {
  //     let newBeats = [];
  //     for (let i = 0; i < props.numBeats; i++) {
  //       let beat = [];
  //       for (let j = 0; j < 9; j++) {
  //         beat.push({
  //           doesExist: false,
  //           duration: 0,
  //           isRest: false,
  //           accidental: "natural",
  //           pitch: j,
  //         });
  //       }
  //       newBeats.push(beat);
  //     }
  //     setBeats([...newBeats]);
  //   }
  // }, [props.numBeats]);
  useEffect(() =>{
    console.log("The beats array is: " + JSON.stringify(beats));
    setBeats([...props.beatsArray]);
    setMeasureNumber(props.measureNumber);
    console.log("measure number: " + measureNumber);
  }, [])



  return (
    <div className="measure">
      {beats.map((beat, index) => {
        return (
          <Beat
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
  
  return (
    <div className="beat">
      {props.notesArray.map((note, index) => {
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
  let pieceObject = useContext(PieceContext);
  const [doesExist, setDoesExist] = useState(props.doesExist);
  const [pitch, setPitch] = useState(props.pitch);
  const [noteobj, setNoteObj] = useState({});
  const [noteDuration, setNoteDuration] = useState(props.duration);
  const [accidental, setAccidental] = useState(props.accidental);
  const [noteImgSrc, setNoteImgSrc] = useState(undefined);
  const [showEditOptions, setShowEditOptions] = useState(false);

  useEffect(() => {
    let imgTag = undefined;
    if (!doesExist && pitch % 2 === 0) {
      imgTag = <img src="/horizontalLine.png" alt="empty line" />;
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
      imgTag = <img src="/blankNote.jpg" alt="empty line" />;
      setNoteImgSrc("/blankNote.jpg");
    }
  }, [noteDuration, accidental]);

  const handleNoteDurationChange = (e) => {
    setNoteDuration(e.target.value);
  };

  const handleNoteAccidentalChange = (e) => {
    setAccidental(e.target.value);
  };

  const updateNote = (id, newNote, piece) => {
    console.log("id is: " + id);
    //find which staff it's in
    const staffNum = Math.floor(id / (9 * piece.beatsPerMeasure * 4)); //9 notes per beat 4 measures in one staff
    //find out what measure it is in
    const measureNum = Math.floor(
      (id - 9 * piece.beatsPerMeasure * 4 * staffNum) /
        (piece.beatsPerMeasure * 9)
    );
    //find which beat it's in
    const beatNum = (id % (9 * piece.beatsPerMeasure)) % 9;
    //find the note to change
    const noteNum = newNote.pitch;
    console.log("staffNum: " +staffNum +" measureNum: " +measureNum +" beatNum: " +beatNum +" noteNum: " +noteNum);

    //update the note to the new note
    piece.staffsArray[staffNum].measuresArray[measureNum].beatsArray[beatNum].notesArray[noteNum] = { ...newNote };
  };

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
      className={`note ${props.note.duration} ${props.note.isRest} ${props.note.doesExist} ${props.note.accidental}`}
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
          <option value="eigth">1/8</option>
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
