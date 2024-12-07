import React from "react";


const naver = (props) => {
    const login = props.login;
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_NAVER_REDIRECT_URL}`;
    const STATE = process.env.REACT_APP_NAVER_SECRET_KEY;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}/naver`;

    const NaverLogin = () => {
        console.log('a');
        console.log(process.env.REACT_APP_NAVER_CLIENT_ID);
        console.log(NAVER_AUTH_URL);
        console.log(REDIRECT_URI);
        window.location.href = NAVER_AUTH_URL;

    };

    const NaverLogout = () => {
        window.location.href = `http://nerbs0313.godohosting.com/wordSN/index.html`;
    };

    return login === 'true' ?
        <button style={{ fontFamily: 'DungGeunMo' }} className="login-logout-button" onClick={NaverLogout}>로그아웃</button>
        :
        <button style={{ fontFamily: 'DungGeunMo' }} className="login-logout-button" onClick={NaverLogin}>로그인</button>
};

export default naver;