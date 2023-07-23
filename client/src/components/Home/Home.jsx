import "./Home.css";
import {useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import Modal from 'react-modal';
import { cookies } from "../../App";
import axios from "axios";




export const Home = () =>{
    const [username, setUsername] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);
    //modal selections
    const [timeSignature, setTimeSignature] = useState("44");
    const [songName, setSongName] = useState("");
    const [numberOfBars, setNumberOfBars] = useState(8);
    const navigate = useNavigate();


    useEffect(() =>{
        //get the username from universal cookie
        setUsername(cookies.get("username"));
    }, []);


    const handleLogout = () =>{
        //delete the username cookie 
        //transport user back to the login page
        navigate("/");
    }



    //modal functions
    const handleSongNameChange = (e) =>{
        setSongName(e.target.value);
    }

    const handleNumberBarsChange = (e) =>{
        setNumberOfBars(e.target.value);
    }

    const handleTimeSigChange = (e) =>{
        setTimeSignature(e.target.value);
    }

    const handleCreateSong = async () =>{
        //send all data to the backend
        const res = await axios.post("http://localhost:8080/composition/createNewComposition", {
            songName: songName, 
            numberOfBars: numberOfBars,
            timeSignature: timeSignature,
            username: username
            })
        //if everything goes as planned
        //navigate to the new view of the new song
    }

    return (

        <div className="home">
            <header>
                <h2>Fermata</h2>
                <p>{username}</p>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => {navigate(`/settings/`)}}>Settings</button>
            </header>
            <main>
                <h1>{`Hello, ${username}!`}</h1>
               
                <div className="options-container">
                    <button onClick={() => {setIsOpen(true)}}>Create New Composition</button>
                    {/* <CompositionList/> */}
                </div>

                
            </main>


            {/* //-----------------------------------------------------MODAL------------------------------------------------------------ */}

            <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {setIsOpen(false)}}
      >

        <button onClick={() => {setIsOpen(false)}}>close</button>
       <div className="modal-options">
        Name of composition: <input type="text" name="song-name" required onChange={(e) => {handleSongNameChange(e)}} value={songName} placeholder="New Song" />
        Number of Bars: <input type="number" name="number-of-bars" required onChange={(e) => {handleNumberBarsChange(e)}} value={numberOfBars} />
        <label htmlFor="time-signatures">Pick a Time Signature</label>
        <select name="time-signatures" id="time-signatures" value={timeSignature} onChange={(e) => {handleTimeSigChange(e)}}>
            <option value="44">4/4</option>
            <option value="34">3/4</option>
            <option value="68">6/8</option>
            <option value="78">7/8</option>
        </select>
        <button onClick={handleCreateSong}>Finish</button>
       </div>
      </Modal>


             {/* //-----------------------------------------------------END MODAL------------------------------------------------------------ */}


        </div>

    );


}