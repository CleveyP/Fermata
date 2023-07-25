import { useState, useEffect, useRef } from "react";
import "./Measure.css";


export const Measure = (props) => {
  const [beats, setBeats] = useState(props.beatsArr);

  useEffect(() => {
    if (beats.length === 0) {
      let newBeats = [];
      for (let i = 0; i < props.numBeats; i++) {
        let beat = [];
        for (let j = 0; j < 9; j++) {
          beat.push({
            doesExist: false,
            duration: 0,
            isRest: false,
            accidental: "natural",
            pitch: j,
          });
        }
        newBeats.push(beat);
      }
      setBeats([...newBeats]);
    }
  }, [props.numBeats]);

  return (
    <div className="measure">
      {beats.map((beat, index) => {
        return <Beat noteArr={beat} key={index} />;
      })}
    </div>
  );
};

const Beat = (props) => {
  return (
    <div className="beat">
      {props.noteArr.map((note, index) => {
        return <Note note={note} key={index} />;
      })}
    </div>
  );
};

const Note = (props) => {
  const [doesExist, setDoesExist] = useState(props.note.doesExist);
  const [pitch, setPitch] = useState(props.note.pitch);

  const [noteDuration, setNoteDuration] = useState("quarter");
  const [accidental, setAccidental] = useState("natural");
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

  const handleCreateNote = () => {
   console.log("the props pitch: " + pitch);
    let src = "/";
    if (accidental === "flat") src += "flat";
    else if (accidental === "sharp") src += "sharp";

    src += noteDuration;
    src += Number(pitch) % 2 === 0 ? "Line" : "Space";
    src += ".png";
    setNoteImgSrc(src);
    setDoesExist(true);
    setShowEditOptions(false); // Hide the popup after creating the note
  };

  const handleClick = () => {
    if(showEditOptions){
        return;
    }
    // Toggle the visibility of the popup when the note is clicked
    setShowEditOptions((prevState) => !prevState);
  };

  return (
    <div
      onClick={handleClick}
      className={`note ${props.note.duration} ${props.note.isRest} ${
        props.note.doesExist
      } ${props.note.accidental}`}
    >
      <img src={noteImgSrc} alt="note" />

      <div className={`edit-note-options ${showEditOptions ? "visible" : "hidden"}`}>
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
      </div>
    </div>
  );
};