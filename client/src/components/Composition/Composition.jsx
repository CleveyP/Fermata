import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Composition.css";
import { Measure } from "./Measure/Measure/Measure";
import { Piece } from "../../Classes/PieceClass";
import axios from "axios";
import { pauseSong, playSong, toBeginning } from "../../playSong";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { getChordByBeatId } from "../AIControls/AILogic";
import { AIControls } from "../AIControls/AIControls";
export const PieceContext = createContext({
  pieceObject: {},
  setPieceObject: () => {},
});

export const Composition = (props) => {
  const navigate = useNavigate();
  const [isAIMode, setIsAIMode] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [pieceObject, setPieceObject] = useState(
   new Piece(props.numMeasures, props.timeSig)
  );
  const [bpm, setBpm] = useState(props.optionsObj.bpm || 120);
  const [trebleSynth, setTrebleSynth] = useState(
    props.optionsObj.trebleSynth || "FM"
  );
  const [bassSynth, setBassSynth] = useState(
    props.optionsObj.BassSynth || "FM"
  );
  const [trebleVolume, setTrebleVolume] = useState(
    props.optionsObj.trebleVolume || 0
  );
  const [bassVolume, setBassVolume] = useState(
    props.optionsObj.bassVolume || 0
  );
  const [attRel, setAttRel] = useState({treble: {att: 0, rel: 0, sus: 0.2, mento: 0}, bass: {att: 0, rel: 0, sus: .2, mento: 0}})
  const [trebleEffects, setTrebleEffects] = useState(
    props.optionsObj.trebleEffects || []
  );
  const [bassEffects, setBassEffects] = useState(
    props.optionsObj.bassEffects || []
  );
  const [activeBeat, setActiveBeat] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
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
    setBpm(props.optionsObj.bpm);
    setTrebleSynth(props.optionsObj.trebleSynth);
    setBassSynth(props.optionsObj.bassSynth);
    setTrebleVolume(props.optionsObj.trebleVolume);
    setBassVolume(props.optionsObj.bassVolume);
    setTrebleEffects(props.optionsObj.trebleEffects || []);
    setBassEffects(props.optionsObj.bassEffects || []);
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
        bassEffects: bassEffects,
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
        <button onClick={() => setIsAIMode(!isAIMode)}>
          {isAIMode ? "Playback Controls" : "AI Mode"}
        </button>
        <button
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </button>
        <button onClick={() => getChordByBeatId(65, pieceObject)}>test</button>
      </div>
      { isAIMode ? <AIControls setActiveBeat={setActiveBeat} composition={pieceObject}/> :
      <div className="music-controls">
        <div className="playback-controls">
          <button
            className="playback-button"
            onClick={() => {
              if (isPaused) {
                setIsPaused(false);
                playSong(
                  pieceObject,
                  Number(bpm),
                  trebleSynth,
                  bassSynth,
                  [trebleEffects, bassEffects],
                  [trebleVolume, bassVolume],
                  setActiveBeat,
                  attRel
                );
              } else {
                setIsPaused(true);
                pauseSong(bpm);
              }
            }}
          >
            {isPaused ? (
              <FontAwesomeIcon icon={faPlay} />
            ) : (
              <FontAwesomeIcon icon={faPause} />
            )}
          </button>
          <button
            onClick={() => {
              toBeginning(bpm, setActiveBeat);
              setIsPaused(true);
            }}
            className="playback-button"
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </button>

          <div className="bpm-box">
            <p>{`BPM: ${bpm}`}</p>
            <input
              type="range"
              min="50"
              max="400"
              step="1"
              value={bpm}
              onChange={handleBpmChange}
            />
          </div>
        </div>
        <div className="synth-controls">
          <div className="treble-controls">
          <div className="attack-release-controls">
                <label htmlFor="attack">Att</label>
                <input type="range" name="attack" id="attack" value={attRel.treble.att} min={0} max={10} step={.5} onChange = {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.treble.att = e.target.value;
                    setAttRel({...newAttRel})}}/>
                <label htmlFor="release">Rel</label>
                <input type="range" name="release" id="release" value={attRel.treble.rel} min={0} max={10} step={.5} onChange = {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.treble.rel = e.target.value;
                    setAttRel({...newAttRel})}}/>
                <label htmlFor="sustain">Sus</label>
                <input type="range" name="sustain" id="sustain" value={attRel.treble.sus}  min={0} max={1} step={.05} onChange = {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.treble.sus = e.target.value;
                    setAttRel({...newAttRel})}}/>
                 <label htmlFor="portamento">pmo</label>
                <input type="range" name="portamento" id="portamento" value={attRel.treble.mento}  min={0} max={10} step={.5} onChange = {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.treble.mento = e.target.value;
                    setAttRel({...newAttRel})}}/>
                <div className="attack-release-display">
                    <p>att: {Number(attRel.treble.att).toFixed(1)}</p>
                    <p>rel: {Number(attRel.treble.rel).toFixed(1)}</p>
                    <p>sus: {Number(attRel.treble.sus).toFixed(1)}</p>
                    <p>pmo: {Number(attRel.treble.mento).toFixed(1)}</p>
                </div>
            </div>
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
              <label htmlFor="treble-volume">
                Treble Volume: {trebleVolume}
              </label>
              <input
                name="treble-volume"
                type="range"
                min={-10}
                max={10}
                step={1}
                value={trebleVolume}
                onChange={(e) => setTrebleVolume(e.target.value)}
              />
            </div>
          </div>
          <div className="bass-controls">
          <div className="attack-release-controls">
                <label htmlFor="attack">Att</label>
                <input type="range" name="attack" id="attack" value={attRel.bass.att} min={0} max={10} step={.5} onChange = {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.bass.att = e.target.value;
                    setAttRel({...newAttRel})}}/>
                <label htmlFor="release">Rel</label>
                <input type="range" name="release" id="release" value={attRel.bass.rel} min={0} max={10} step={.5} onChange = {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.bass.rel = e.target.value;
                    setAttRel({...newAttRel})}}/>
                <label htmlFor="sustain">Sus</label>
                <input type="range" name="sustain" id="sustain" value={attRel.bass.sus}  min={0} max={1} step={.05} onChange =  {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.bass.sus = e.target.value;
                    setAttRel({...newAttRel})}}/>
                     <label htmlFor="portamento">Pmo</label>
                     <input type="range" name="portamento" id="portamento" value={attRel.bass.mento}  min={0} max={10} step={.5} onChange =  {(e) => {
                     let newAttRel = attRel; 
                     newAttRel.bass.mento = e.target.value;
                    setAttRel({...newAttRel})}}/>
                <div className="attack-release-display">
                    <p>att: {Number(attRel.bass.att).toFixed(1)}</p>
                    <p>rel: {Number(attRel.bass.rel).toFixed(1)}</p>
                    <p>sus: {Number(attRel.bass.sus).toFixed(1)}</p>
                    <p>pmo: {Number(attRel.bass.mento).toFixed(1)}</p>
                </div>
            </div>
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
              <input
                name="bass-volume"
                type="range"
                min={-10}
                max={10}
                step={1}
                value={bassVolume}
                onChange={(e) => setBassVolume(e.target.value)}
              />
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
      </div>}

      {
        //map out the staffs
        staffs.map((staff, index) => {
          return (
            <PieceContext.Provider value={value}>
              <Staff
                isAIMode={isAIMode}
                activeBeat={activeBeat}
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
            isAIMode={props.isAIMode}
            clef={props.clef}
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
