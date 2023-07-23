import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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
        console.log(username);
        //make a request to the backend that will ask if the username and password exist in the database of users
        const res = await axios.post("http://localhost:8080/login", {username: username, password: password});
        if(res.data.success){
            //route user to their home page
            alert(`Your user name was: ${res.data.username}`);
        }
        else{
            alert("username and password do not match our records.");
            setUsername("");
            setPassword("");
        }
    }

    const handleCreateAccount = () =>{
        navigate("/register");  //http://localhost:3000/register
    }

    return (
        <div className="login">
            <h1>Hello, This is Fermata!</h1>
            <div className="signin-form">
            <input required  value={username} name="username" type="text" onChange={(e) => handleNameChange(e)}/>
            <input required value={password} name="password" type="password" onChange={(e) => handlePasswordChange(e)}/>
            <button onClick={handleSubmit}>Login</button>
            </div>
        <button onClick={handleCreateAccount}>Create Account</button>

        </div>
    );


}