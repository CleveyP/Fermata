import { useState, useEffect, createContext, useContext } from "react";
import "./Composition.css";
import { Measure } from "./Measure/Measure/Measure";
import {Piece} from "../../Classes/PieceClass";
import axios from "axios";

export const PieceContext = createContext();

export const Composition = (props) =>{
    const [staffs, setStaffs] = useState([]); 
   const [pieceObject, setPieceObject] = useState(new Piece());

    useEffect(() =>{
            const newPiece = Object.assign(new Piece(props.numMeasures, props.timeSig), props.compositionObj);
            setPieceObject(newPiece);
            setStaffs([...newPiece.staffsArray]);
   
    }, [props.timeSig]) 


  const handleSave = async () =>{
    //transform the compositionArray into a json array
    const jsonComposition = JSON.stringify(pieceObject);
    //post the json array to the backend 
    const res = await axios.post("http://localhost:8080/composition/saveComposition", {composition: jsonComposition, songId: props.songId})

    //check if it was a succes
    if(res.data.success){
        alert("saved successfully");
    }
    else{
        alert("could not save the composition!");
    }
  }
   
    return (
        <div className = "composition" >
            <h1>{props.songTitle}</h1>
            <button onClick={handleSave}>Save</button>
            {
               //map out the staffs
               staffs.map( (staff, index) =>{
                    return (
                    <PieceContext.Provider value={pieceObject}>
                        <Staff clef={staff.clef} measures={staff.measuresArray} timeSig={staff.timeSig} staffNumber={staff.staffNumber} key={index}/>
                    </PieceContext.Provider>
                    );
               })
            }
        </div>
    );
}



const Staff = (props) =>{ 
    const [measures, setMeasures] = useState(props.measures);

   
  useEffect(() => {
    // Update the measures state whenever props.measures change
    setMeasures(props.measures);
  }, [props.measures]);
      
    return (

        <div className={`staff ${props.clef}`}>
            <img className={`clef-image ${props.clef}`} src={props.clef == "treble" ? "/trebleClef.png" : "/bassClef.png"} alt="clef"/>
            {
                measures.map((measure, index) =>{
                    return (
                       <Measure beatsArray={measure.beatsArray} measureNumber={measure.measureNumber} key={index}/> 
                    );
                })
            }


        </div>
    )
}