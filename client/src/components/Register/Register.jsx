import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cookies } from "../../App";
import axios from "axios";

export const Register = () =>{

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();



    const handleNameChange = (e) =>{
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e) =>{
        setPassword(e.target.value);
    }

    const handleConfirmPasswordChange = (e) =>{
        setConfirmPassword(e.target.value);
    }


    const handleCreateAccount = async () =>{

        //make sure that the password matches the confirm password
        if(password !== confirmPassword){
            alert("your password and confirm password do not match!");
            return;
        }

        //make a request to the backend that will ask if the username and password exist in the database of users
        //if it does not exist, register the new username and password
        const res = await axios.post("http://localhost:8080/user/register", {username: username, password: password});
        if(res.data.success){
             //set the username as a cookie
             cookies.set('username', username);
            //route user to their home page
            navigate("/home");
        }
        else{
            setUsername("");
            setPassword("");
        }
    }




    return (
        <div className="register">
            <h1>Hello, This is Fermata!</h1>
            <div className="register-form">
           Username:  <input required  value={username} name="username" type="text" onChange={(e) => handleNameChange(e)}/>
           Password: <input required value={password} name="password" type="password" onChange={(e) => handlePasswordChange(e)}/>
           Confirm Password: <input required value={confirmPassword} name="confirm-password" type="password" onChange={(e) => handleConfirmPasswordChange(e)}/>
           <button onClick={handleCreateAccount}>Create Account</button>
            </div>
        

        </div>
    );
}