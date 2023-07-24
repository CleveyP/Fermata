import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Composition } from '../Composition/Composition';
import "./EditComposition.css";

export const EditComposition = () =>{
    //get the id of the composition from url
    const { songId } = useParams();

    const [songTitle, setSongTitle] = useState("");
    const [numBars, setNumBars] = useState(8); //these are not getting reset for some reason
    const [timeSig, setTimeSig] = useState(0);
    const [compositionArr, setCompositionArr] = useState([]); //a composition array is an array of every staff


    useEffect( () =>{
        if(!songId){
            return;
        }
        //use the songId to get all the info about song from database
        const getSongData = async () =>{
           
            const res = await axios.post("http://localhost:8080/composition/getSongData/" + songId);
            if(!res.data.success){
                console.log("error in fetching song data");
                return;
            }
            else{
                setSongTitle(res.data.songTitle);
                setNumBars(Number(res.data.numBars)); //this is NOT UPDATING
                setTimeSig(Number(res.data.timeSig)); //this is NOT UPDATING
                setCompositionArr(res.data.compositionArr || []);
            }
        }

        getSongData();

    }, [songId] );



    return (
        <div className="edit-composition-container">
            <h1>{songTitle}</h1>
            <Composition compositionArray={compositionArr} numMeasures={numBars} timeSig={timeSig}/>
        </div>
    );



}