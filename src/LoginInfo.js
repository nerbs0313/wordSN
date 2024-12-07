// LoginInfo.js
import React from 'react';

function LoginInfo(props) {
    const login = props.login;
    const userid = props.email;

    return login === 'true' ? <div> {userid} </div> : <div> </div>;
}

export default LoginInfo;
