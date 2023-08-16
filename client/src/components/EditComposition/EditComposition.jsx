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
    const [compositionObj, setCompositionObj] = useState({}); //a composition array is a json array of staves > measures > beats > notes
    const [optionsObj, setOptionsObj] = useState({})

    useEffect( () =>{
        if(!songId){
            return;
        }
        //use the songId to get all the info about song from database
        const getSongData = async () =>{
           
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/composition/getSongData/` + songId);
            if(!res.data.success){
                console.log("error in fetching song data");
                return;
            }
            else{
                setSongTitle(res.data.songTitle);
                setNumBars(Number(res.data.numBars)); 
                setTimeSig(Number(res.data.timeSig)); 
                //create an options object and set the state to it
                let newOptions = {
                    bpm: res.data.bpm,
                    trebleSynth: res.data.trebleSynth,
                    bassSynth: res.data.bassSynth,
                    trebleEffects: res.data.trebleEffects,
                    bassEffects: res.data.bassEffects,
                    trebleVolume: res.data.trebleVolume,
                    bassVolume: res.data.bassVolume
                };
                setOptionsObj({...newOptions});
                setCompositionObj(JSON.parse(res.data.compositionArray));
            }
        }

        getSongData();

    }, [songId] );



    return (
        <div className="edit-composition-container">
            <h1>{songTitle}</h1>
            <Composition compositionObj={compositionObj} numMeasures={numBars} timeSig={timeSig} songId={songId} optionsObj={optionsObj}/>
        </div>
    );



}