import React, {useState} from 'react';
import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase';

function LoginPage({setUser, setLoggedIn}) {
    const [wrong, setWrong] = useState("");
    useState(()=>{
    }, [])
    return(
        <div id="login">
            <div className="container">
                {/* <label for="uname"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="uname" required></input> */}

                <label for="psw"><b>Code</b></label>
                <input id="txtCode" type="password" placeholder="Enter Code" name="psw" required></input>
                <p>{wrong}</p>
                <button id="btnVerify" type="submit" onClick={
                    (event) => {
                        let txtCode = document.getElementById("txtCode");
                        const pass = txtCode.value;
                        if(pass==="COGS222") setUser(true)
                        else {setUser(null); setWrong("Wrong code.")}
                    }
                }>Verify</button>
                <label>Remember Me &nbsp;</label>
                <input type="checkbox" checked="checked" name="remember"></input>
            </div>
        </div>

    )
}
export default LoginPage;

