import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Composition.css";
import { Measure } from "./Measure/Measure/Measure";
import { Piece } from "../../Classes/PieceClass";
import axios from "axios";
import { pauseSong, playSong } from "../../playSong";

export const PieceContext = createContext({
  pieceObject: {},
  setPieceObject: () => {},
});

export const Composition = (props) => {
  const navigate = useNavigate();
  const [staffs, setStaffs] = useState([]);
  const [pieceObject, setPieceObject] = useState(
    new Piece(props.numMeasures, props.timeSig)
  );
  const [bpm, setBpm] = useState(props.optionsObj.bpm || 120);    
  const [trebleSynth, setTrebleSynth] = useState(props.optionsObj.trebleSynth || "FM");
  const [bassSynth, setBassSynth] = useState(props.optionsObj.BassSynth || "FM");
  const [trebleVolume, setTrebleVolume] = useState(props.optionsObj.trebleVolume || 0);  
  const [bassVolume, setBassVolume] = useState(props.optionsObj.bassVolume || 0);
  const [trebleEffects, setTrebleEffects] = useState(props.optionsObj.trebleEffects || []);
  const [bassEffects, setBassEffects] = useState(props.optionsObj.bassEffects || []);
  const [activeBeat, setActiveBeat] = useState(0);

  const effectOptions = [
    "distortion",
    "chorus",
    "LFO",
    "feedbackDelay",
    "bitCrusher",
  ];

  let value = { pieceObject, setPieceObject };

  useEffect(() => {
    const newPiece = Object.assign(
      new Piece(props.numMeasures, props.timeSig),
      props.compositionObj
    );
    setPieceObject(newPiece);
    setBpm(props.optionsObj.bpm)
    setTrebleSynth(props.optionsObj.trebleSynth)
    setBassSynth(props.optionsObj.bassSynth)
    setTrebleVolume(props.optionsObj.trebleVolume)
    setBassVolume(props.optionsObj.bassVolume)
    setTrebleEffects(props.optionsObj.trebleEffects || [])
    setBassEffects(props.optionsObj.bassEffects || [])
    setStaffs([...newPiece.staffsArray]);

  }, [props.timeSig, props.bassEffects, props.trebleEffects]);

  const handleBpmChange = (e) => {
    setBpm(e.target.value);
  };

  const handleCheckboxChange = (event, clef) => {
    const { name, checked } = event.target;
    if (clef === "treble") {
      setTrebleEffects((prevCheckedItems) =>
        checked
          ? [...prevCheckedItems, name]
          : prevCheckedItems.filter((item) => item !== name)
      );
    } else {
      setBassEffects((prevCheckedItems) =>
        checked
          ? [...prevCheckedItems, name]
          : prevCheckedItems.filter((item) => item !== name)
      );
    }
  };

  const handleSave = async () => {
    //transform the compositionArray into a json array
    const jsonComposition = JSON.stringify(pieceObject);
    //post the json array to the backend
    const res = await axios.post(
      "http://localhost:8080/composition/saveComposition",
      { 
        composition: jsonComposition,
        songId: props.songId,
        bpm: bpm,
        trebleSynth: trebleSynth,
        bassSynth: bassSynth,
        trebleVolume: trebleVolume,
        bassVolume: bassVolume,
        trebleEffects: trebleEffects,
        bassEffects: bassEffects 
    }
    );

    //check if it was a succes
    if (res.data.success) {
      console.log("successfully saved the composition!");
      alert("saved successfully");
    } else {
      console.log("failed to save the composition");
      alert("could not save the composition!");
    }
  };

  return (
    <div className="composition">
      <h1>{props.songTitle}</h1>
      <div className="composition-control-btns">
        <button onClick={handleSave}>Save</button>
        <button
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </button>
        </div>
        <div className="music-controls">
          <button
            onClick={() => {
              playSong(pieceObject, Number(bpm), trebleSynth, bassSynth, [
                trebleEffects,
                bassEffects,
              ], [trebleVolume, bassVolume]);
            }}
          >
            Play
          </button>
          <button onClick={() => pauseSong(bpm)}>Pause</button>
          <div className="bpm-box">
            <p>{`BPM: ${bpm}`}</p>
            <input
              type="range"
              min="50"
              max="500"
              step="1"
              value={bpm}
              onChange={handleBpmChange}
            />
          </div>
          <div className="synth-controls">
            <div className="treble-controls">
              <label htmlFor="treble-synth">Treble Synth Effect</label>
              <select
                name="treble-synth"
                value={trebleSynth}
                onChange={(e) => setTrebleSynth(e.target.value)}
              >
                <option value="FM">FM</option>
                <option value="SYNTH">SYNTH</option>
                <option value="AM">AM</option>
                <option value="MONO">MONO</option>
                <option value="DUO">DUO</option>
              </select>
              <div className="treble-vol-box">
                <label htmlFor="treble-volume">Treble Volume: {trebleVolume}</label>
                <input name="treble-volume" type="range" min={-10} max={10} step={1}  value={trebleVolume} onChange={(e) => setTrebleVolume(e.target.value)} />
              </div>
              </div>
              <div className="bass-controls">
                <label htmlFor="bass-synth">Bass Synth Effect</label>
                <select
                  name="bass-synth"
                  value={bassSynth}
                  onChange={(e) => setBassSynth(e.target.value)}
                >
                  <option value="FM">FM</option>
                  <option value="SYNTH">SYNTH</option>
                  <option value="AM">AM</option>
                  <option value="MONO">MONO</option>
                  <option value="DUO">DUO</option>
                </select>
                <div className="bass-vol-box">
                  <label htmlFor="bass-volume">Bass Volume: {bassVolume}</label>
                  <input name="bass-volume" type="range" min={-10} max={10} step={1}  value={bassVolume} onChange={(e) => setBassVolume(e.target.value)} />
              </div>
              </div>
            </div>
            <div className="effects-box">
              {/* treble effects checkboxes */}
              <div className="treble effects-container">
                <h2>Treble Effects</h2>
                {effectOptions.map((option) => (
                  <div key={option}>
                    <label>
                      <input
                        type="checkbox"
                        name={option}
                        checked={trebleEffects.includes(option)}
                        onChange={(e) => handleCheckboxChange(e, "treble")}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              {/* bass effects checkboxes */}

              <div className="bass effects-container">
                <h2>Bass Effects</h2>
                {effectOptions.map((option) => (
                  <div key={option}>
                    <label>
                      <input
                        type="checkbox"
                        name={option}
                        checked={bassEffects.includes(option)}
                        onChange={(e) => handleCheckboxChange(e, "bass")}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

      {
        //map out the staffs
        staffs.map((staff, index) => {
          return (
            <PieceContext.Provider value={value}>
              <Staff
                clef={staff.clef}
                measures={staff.measuresArray}
                timeSig={staff.timeSig}
                staffNumber={staff.staffNumber}
                key={index}
              />
            </PieceContext.Provider>
          );
        })
      }
    </div>
  );
};

const Staff = (props) => {
  const [measures, setMeasures] = useState(props.measures);

  useEffect(() => {
    // Update the measures state whenever props.measures change
    setMeasures(props.measures);
  }, [props.measures]);

  return (
    <div className={`staff ${props.clef}`}>
      <img
        className={`clef-image ${props.clef}`}
        src={props.clef == "treble" ? "/trebleClef.png" : "/bassClef.png"}
        alt="clef"
      />
      {measures.map((measure, index) => {
        return (
          <Measure
            activeBeat={props.activeBeat}
            beatsArray={measure.beatsArray}
            measureNumber={measure.measureNumber}
            key={index}
          />
        );
      })}
    </div>
  );
};

