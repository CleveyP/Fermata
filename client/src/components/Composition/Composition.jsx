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
        //if this is a new composition:
        if(props.compositionArray.length == 0){
            //populate the trebleStaffs and bass staffs arrays with the number of staffs 
            let stfs = [];
            for(let i=0; i< props.numMeasures / 4; i++){
                //create an empty treble and bass staff
                let trebleStaff = [];
                let bassStaff = [];
                //populate the trebleStaff and bass staff with 4 measures
                
                for(let j = 0; j< 4; j++){
                    //allow up to 16th notes
                    trebleStaff.push(<Measure measureNum= {i*4+j}  clef="treble" numBeats={Math.floor(props.timeSig / 10)} beatsArr={[]}/>); //Ex timeSig = 68 ... 68/10 = 6
                    bassStaff.push(<Measure measureNum= {i*4+j}  clef="bass" numBeats={Math.floor(props.timeSig / 10)} beatsArr={[]}/>);

                }

                //push the trebleStaff and bass staff into the trebleStaffs and bassStaffs arrays
                stfs.push(trebleStaff);
                stfs.push(bassStaff);
            }
            //set the trebleStaffs and bassStaffs stateful vars
            setStaffs([...stfs]);
            const newPiece = new Piece(props.numMeasures, props.timeSig);
            setPieceObject({...newPiece});
        }
        //if the composition is already in progress:
        else{
            setStaffs([...props.compositionArray]);
            const newPiece = new Piece(staffs);
            setPieceObject({...newPiece});
        }
        //update the Piece object
       
   
    }, [props.timeSig]) 


  const handleSave = async () =>{
    //transform the compositionArray into a json array
    const jsonComposition = JSON.stringify(pieceObject);
    //post the json array to the backend 
    const res = await axios.post("/composition/saveComposition", {composition: jsonComposition})
    //backend will push the json array into the CompositionModel 

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
                        <Staff clef={index%2 == 0 ? "treble" : "bass"} measures={staff} />
                    </PieceContext.Provider>
                    );
               })
            }


        </div>
    );
}



const Staff = (props) =>{
    const pieceObject = useContext(PieceContext);  
    console.log(JSON.stringify(pieceObject));
    return (

        <div className={`staff ${props.clef}`}>
            <img className={"clef-image ${props.clef}"} src={props.clef == "treble" ? "/trebleClef.png" : "/bassClef.png"} alt="clef"/>
            {
                props.measures.map((measure, index) =>{
                    return measure;
                })
            }


        </div>
    )
}