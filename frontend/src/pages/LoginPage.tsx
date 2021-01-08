import React, {useState} from "react";
import {CodeBox} from "../components/CodeBox";
import axios from "axios";
import Table from 'react-bootstrap/Table';

function LoginPage(props:any) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = () => {
        axios.post(`/users/login`, {
            username,
            password
        }).then(res => {
            console.log(res);
            const userdata = {
                id: res.data._id,
                username: res.data.username,
            }
            localStorage.setItem('user', JSON.stringify(userdata))
            props.setLoggedin(true);
        }).catch(res => {
            console.log(res.response)
        })
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Consola"
        }}>
            <div style={{marginBottom: 20, fontSize: 24}}>Login</div>
            <form>
                <label>Username :
                    <input onChange={x => setUsername(x.target.value)}/>
                </label>
                <br/>
                <label>Password :
                    <input onChange={x => setPassword(x.target.value)}/>
                </label>
                {/* nb: passwords will be stored in plain text, need to indicate to them, or submit as a hash */}
                <br/>
            </form>
            <button onClick={loginHandler}>Log In</button>
        </div>
    );
}


export default LoginPage;
