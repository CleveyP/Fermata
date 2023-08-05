import "./Home.css";
import {useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import Modal from 'react-modal';
import { cookies } from "../../App";
import axios from "axios";
import { Piece } from "../../Classes/PieceClass";




export const Home = () =>{
    const [refreshSongList, setRefreshSongList] = useState(false);
    const [username, setUsername] = useState("");
    const [songList, setSongList] = useState([]); //array of { songId: ,  title: }
    const [modalIsOpen, setIsOpen] = useState(false);
    //modal selections
    const [timeSignature, setTimeSignature] = useState("44");
    const [songName, setSongName] = useState("");
    const [numberOfBars, setNumberOfBars] = useState(8);
    const navigate = useNavigate();

    //setup the username and the list of their songs
    useEffect(() =>{
       
        //query compositionModel by username and get all of user's compositions
        const getSongs = async () =>{
             //get the username from universal cookie
        setUsername(cookies.get("username"));
            const songList = await axios.post("http://localhost:8080/composition/getSongsByUsername", {username: cookies.get("username")});
            if(songList.data.success){
                setSongList(songList.data.songsList);
            }
        }

        getSongs();
        
    }, [refreshSongList]);

    const refresh = () =>{
        setRefreshSongList(!refreshSongList);
    }

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
        //create a new Piece object
       const newPiece =  new Piece(numberOfBars, timeSignature);
       const json = JSON.stringify(newPiece);
        //JSONStringify the Piece object into a json string
        //send all data to the backend

        const res = await axios.post("http://localhost:8080/composition/createNewComposition", {
            songName: songName, 
            numberOfBars: numberOfBars,
            timeSignature: timeSignature,
            username: username,
            compositionArray: json
    });
        //if everything goes as planned
        //navigate to the new view of the new song
        if(res.data.success){
            navigate(`/editComposition/${res.data.songId}`);
        }
    }

    return (

        <div className="home">
            <header>
                <h2>Fermata</h2>
                <p>{username}</p>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => {navigate(`/settings`)}}>Settings</button>
            </header>
            <main>
                <h1>{`Hello, ${username}!`}</h1>
               
                <div className="options-container">
                    <button onClick={() => {setIsOpen(true)}}>Create New Composition</button>
                    {/* <CompositionList/> */}
                </div>
                <SongList songList={songList} refresh={refresh}/>
                
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
        <button onClick= {handleCreateSong}>Finish</button>
       </div>
      </Modal>
             {/* //-----------------------------------------------------END MODAL------------------------------------------------------------ */}

        </div>

    );


}

const SongList = (props) =>{
    const navigate = useNavigate();

    const handleDelete = async (e) =>{
        const songId = e.currentTarget.getAttribute('songid');
        const deleteResult = await axios.post("http://localhost:8080/composition/delete", {songId: songId})
        //trigger rerendering of the song list
        props.refresh();
    }
    //switch user to the edit view of the song that they clicked
    const handleClick = async (e) =>{
        //get the songId of the clicked song
        const songId = e.currentTarget.getAttribute('songid');
        console.log("the clicked song's id is: " + songId);
        
        //navigate to the editComposition component using the song's id
        navigate(`/editComposition/${songId}`);
    }


    return (
        <div className = "song-list">
            <h1>Your Songs:</h1>
            <div className="songs-list">
            {
                props.songList.map((song) =>{
                    console.log(song._id);
                    return (
                    <div className = "song-item" >
                        <p songid={song._id}  onClick={(e) => {handleClick(e)}}>{song.title}</p>
                        <button songid={song._id} onClick={(e) => handleDelete(e)}>X</button>
                    </div>
                    );
                })
            }
            </div>


        </div>
    )
}