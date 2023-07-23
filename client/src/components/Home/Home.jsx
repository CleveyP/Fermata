import "./Home.css";
import {useState, useEffect} from "react";
import { useNavigate} from "react-router-dom";
import { cookies } from "../../App";

export const Home = () =>{
    const [username, setUsername] = useState("");
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
                    <button>Create New Composition</button>
                    {/* <CompositionList/> */}
                </div>

                
            </main>

        </div>

    );


}