import "./Home.css";
import {useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import Modal from 'react-modal';
import { cookies } from "../../App";
import axios from "axios";
import { Piece } from "../../Classes/PieceClass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";



export const Home = () =>{
    const [refreshSongList, setRefreshSongList] = useState(false);
    const [username, setUsername] = useState("");
    const [songList, setSongList] = useState([]); //array of { songId: ,  title: , date: }
    const [modalIsOpen, setIsOpen] = useState(false);
    //modal selections
    const [timeSignature, setTimeSignature] = useState("44");
    const [songName, setSongName] = useState("");
    const [numberOfBars, setNumberOfBars] = useState(8);
    const navigate = useNavigate();


    //setup the username and the list of their songs
    useEffect(() =>{
        //if user somehow gets to /home page without logging in or registering, redirect them to the login page.
        if(cookies.get("username") == undefined){
            navigate("/");
            return;
        }
        //query compositionModel by username and get all of user's compositions
        const getSongs = async () =>{
             //get the username from universal cookie
        setUsername(cookies.get("username"));
            const songList = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/composition/getSongsByUsername`,
             {username: cookies.get("username")},
             {withCredentials: true});
            if(songList.data.success){
                setSongList(songList.data.songsList);
            }
        }

        getSongs();
        
    }, [refreshSongList]);

    const refresh = () =>{
        setRefreshSongList(!refreshSongList);
    }

    const handleLogout = async () =>{
       
        //API will destroy the user's session
        const result =  await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/logout`,  {withCredentials: true});
        if(result.data.success){
            //delete the username cookie
            cookies.remove("username");
             //transport user back to the login page
            navigate("/");
        }
        else
            alert("ERR: Could not log user out!");
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

        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/composition/createNewComposition`, {
            songName: songName, 
            numberOfBars: numberOfBars,
            timeSignature: timeSignature,
            username: username,
            compositionArray: json
    },  {withCredentials: true});
        //if everything goes as planned
        //navigate to the new view of the new song
        if(res.data.success){
            navigate(`/editComposition/${res.data.songId}`);
        }
        else if(res.data.message){
            alert(res.data.message);
        }
    }

    return (

        <div className="home">
            <header>
                <h2>Fermata</h2>
              
                <div className="nav-buttons">
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => {navigate(`/settings`)}}>Settings</button>
                    <button onClick={() => {navigate('/about')}}>About</button>
                </div>
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
    const [nameId, setNameId] = useState(0);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [songName, setSongName] = useState("");

    const navigate = useNavigate();

    const handleDelete = async (e) =>{
        const songId = e.currentTarget.getAttribute('songid');
        const deleteResult = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/composition/delete`, {songId: songId}, {withCredentials: true})
        //trigger rerendering of the song list
        props.refresh();
    }

    //switch user to the edit view of the song that they clicked
    const handleClick = async (e) =>{
        //get the songId of the clicked song
        const songId = e.currentTarget.getAttribute('songid');
        
        //navigate to the editComposition component using the song's id
        navigate(`/editComposition/${songId}`);
    }

    const updateSongName = async (newName) =>{
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/composition/updateTitle`, {nameId: nameId, newName: newName, username: cookies.get("username") }, {withCredentials: true});
        console.log(res.data);
        if(res.data.success){
            setIsOpen(false);
            //trigger rerendering of the song list
            props.refresh();
        }
        else{
            alert(res.data.errorMessage);
        }
        
    }

    const handleSongNameChange = (e) =>{
        setSongName(e.target.value);
    }


    return (
        <div className = "song-list">
            <h1>{(props.songList.length == 0) ? "Get started creating your masterpieces!" : "Your Songs:"}</h1>
           
           {props.songList.length != 0 && <div className="songs-list">
            {   
                props.songList.map((song, index) =>{
                   let formattedDate = ""; 
                   if(song.date){ 
                   const currentDate = song.date;
                   
                    //formattedDate looks like Month/day/year format : 00/00/0000
                   formattedDate =  (Number(currentDate.month) + 1).toString()  + "/" + currentDate.day + "/" + currentDate.year;
                   }
                   
                    return (
                    <div className = "song-item" key={index}>
                        <div className="name-and-edit">
                            <p songid={song._id}  onClick={(e) => {handleClick(e)}}>{song.title}</p>
                            <button className="update-name-btn" songid={song._id} onClick={(e) => { setNameId(e.currentTarget.getAttribute("songid")); setIsOpen(true)}}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </div>
                        <p className="date-paragraph">{formattedDate}</p>
                        <button songid={song._id} onClick={(e) => handleDelete(e)}>X</button>
                    </div>
                    );
                })
            }
            </div> }

            {/* //-----------------------------------------------------MODAL------------------------------------------------------------ */}

            <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {setIsOpen(false)}}
      >

        <button onClick={() => {setIsOpen(false)}}>close</button>
       <div className="modal-options">
        Rename to: <input type="text" name="song-name" required onChange={(e) => {handleSongNameChange(e)}} value={songName} placeholder="New Song" />
     
        <button onClick= { () => {updateSongName(songName); }}>Rename</button>
       </div>
      </Modal>
             {/* //-----------------------------------------------------END MODAL------------------------------------------------------------ */}

        </div>
    )
}