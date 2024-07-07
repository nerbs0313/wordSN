import React, { useState } from 'react';
import './Modal.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Naver from './naver';
const STORAGE_KEY = "@toDos";
const Modal = ({ closeModal, changeTheme, selectedTheme }) => {

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    changeTheme(newTheme);
  };

  const urlParams = new URLSearchParams(window.location.search);
  var email = urlParams.get('email')
  var login = urlParams.get('login')

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSave = async (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    var email = urlParams.get('email')
    var login = urlParams.get('login')
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(email);
    console.log(login);
    if (!email || !login) {
      console.log('로그인필요');
      toast.warning('로그인 필요!');
    }
    else {
      console.log(s);
      fetch(`${process.env.REACT_APP_NAVER_REDIRECT_URL}/saveBookmark/inform?email=${email}&bookMarklist=${s}`)
        .then((res) => res.text())
        .then((data) => console.log(data));
      toast.warning('저장 완료');
    }
  };

  const handleLoad = async (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const email = urlParams.get('email')
    const login = urlParams.get('login')
    console.log(email);
    console.log(login);
    if (!email || !login) {
      console.log('로그인필요');
      toast.warning('로그인 필요!');
    }
    else {

      fetch(`${process.env.REACT_APP_NAVER_REDIRECT_URL}/loadBookMark/${email}`)
        .then((res) => res.json())
        .then(async (data) => {


          if (null != data[0].bookmark) {
            await AsyncStorage.clear();
            console.log("초기화완료")

            const result = JSON.parse(data[0].bookmark);
            console.log(result)

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result)) //Object to String

            window.location.replace("");
          }
          else {
            toast.warning('저장된 북마크 기록이 없습니다.');
          }
        });
    }
  }


  const handleLoginLogoutToggle = () => {

    setIsLoggedIn(prevState => !prevState);
  };

  const loginLogoutContent = isLoggedIn ? '로그아웃' : '로그인';

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // 로그아웃 로직 구현
      alert('로그아웃되었습니다.');
    } else {
      // 로그인 로직 구현
      alert('로그인되었습니다.');
    }
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>X</button>
        <div className="button-container">

          <Naver email={email} login={login} />

          <button className="save-button" onClick={handleSave}>저장</button>
          <button className="load-button" onClick={handleLoad}>불러오기</button>

        </div>
        <div className="theme-select">
          <label htmlFor="theme-select">테마 선택 </label>
          <select id="theme-select" value={selectedTheme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="peach">Peach</option>
            <option value="sky">Sky</option>
            <option value="autumn">Autumn</option>
            <option value="candy">Candy</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default Modal;