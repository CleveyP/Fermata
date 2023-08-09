//Requirements:
//user can select their key signature
//user can select select the beat they want to add a note to
//AIControls remembers what suggestions it has made for each beat of the song.
//using a Map where the key is the beat Id and the value is an array of pairs where a pair is <NoteObj, placementValue>
//the array is sorted in descending order from most valued NoteObj to least. 
import { PieceContext } from "../Composition/Composition";
import {useState, useContext} from "react";





export const AIControls = (props) =>{
    const [keySignature, setKeySignature] = useState("C");
    const [selectedBeat, setSelectedBeat] = useState(0);
    const [selectedClef, setSelectedClef] = useState("treble");
    let {pieceObject, setPieceObject} = useContext(PieceContext);

    const keySignatures = ["A", 'B', "C", "D", "E", "F", "G", "Ab", 'Bb', "Cb", "Db", "Eb", "Fb", "Gb" ];
    const handleAddNote = () =>{
        
    }
    return (
        <div className="ai-controls-box">
            <h1>AI CONTROLS</h1>
            <div className="ai-controls music-controls">

                <select onChange={(e) => {setKeySignature(e.target.value)}} value={keySignature}>
                    {
                        keySignatures.map((sig) =>{
                            return <option value={sig} key={sig}>{sig}</option>
                        })
                    }
                </select>
                <div>
                    <label htmlFor="selected-beat"> Selected Beat: </label>
                    <input type="number" id="selected-beat-input" value={selectedBeat} onChange={(e) => {setSelectedBeat(e.target.value); console.log(e.target.value); props.setActiveBeat(Number(e.target.value))}}/>
                </div>
               
                <fieldset>
                    <legend>Selected Clef</legend>

                    <div>
                        <input type="radio" id="treble" name="clef" value="treble" checked={selectedClef === "treble"} onChange={ (e) =>{setSelectedClef(e.target.value)}} />
                        <label htmlFor="treble">Treble</label>
                    </div>

                    <div>
                        <input type="radio" id="bass" name="clef" value="bass" checked = {selectedClef === "bass"} onChange={ (e) =>{setSelectedClef(e.target.value)}}/>
                        <label htmlFor="bass">Bass</label>
                    </div>
                </fieldset>
                <button onClick={() => handleAddNote(selectedBeat, pieceObject, keySignature, selectedClef)}>Add Note</button>
            </div>
        </div>
    );


}