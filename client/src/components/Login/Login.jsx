import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { cookies } from "../../App";
import "./Login.css";

export const Login = (props) =>{

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();



    const handleNameChange = (e) =>{
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) =>{
        setPassword(e.target.value);
    }


    const handleSubmit = async () =>{
        //make a request to the backend that will ask if the username and password exist in the database of users
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {username: username, password: password});
        if(res.data.success){
            //set the username as a cookie
            cookies.set('username', username);
            //route user to their home page
             navigate("/home");
        }
        else{
            alert("username and password do not match our records.");
            setUsername("");
            setPassword("");
        }
    }

    const handleCreateAccount = () =>{
        navigate("/register"); 
    }

    return (
        <div className="login">
            <h1>Hello, This is Fermata!</h1>
            <div className="signin-form">
                <label htmlFor="username">Username</label>
                <input required  value={username} name="username" type="text" onChange={(e) => handleNameChange(e)}/>
                <label htmlFor="password">Password</label>
                <input required value={password} name="password" type="password" onChange={(e) => handlePasswordChange(e)}/>
                <div className="button-div">
                    <button onClick={handleSubmit}>Login</button>
                    <button onClick={handleCreateAccount}>Create Account</button>
                </div>
               
            </div>
       


        </div>
    );


}