import { useState, useEffect } from "react";
import "./Composition.css";
import { Measure } from "./Measure/Measure/Measure";



export const Composition = (props) =>{
    const [staffs, setStaffs] = useState([]); 
   const [composition, setComposition] = useState({});
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
        }
        //if the composition is already in progress:
        else{
            setStaffs([...props.compositionArray]);
        }
   
    }, [props.timeSig]) 


  
   
    return (
        <div className = "composition" >
            <h1>{props.songTitle}</h1>

            {
               //map out the staffs
               staffs.map( (staff, index) =>{
                    return <Staff clef={index%2 == 0 ? "treble" : "bass"} measures={staff} />
               })
            }


        </div>
    );
}



const Staff = (props) =>{

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