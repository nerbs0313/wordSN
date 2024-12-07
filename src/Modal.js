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
      toast.warning("로그인하시면 북마크를 \n 이용하실 수 있어요! ", {
        style: {
          fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
          fontSize: '16px', // 글씨 크기 설정
          fontWeight: 'bold', // 글씨 굵기 설정
          whiteSpace: 'pre-line', // 줄 바꿈 적용
        }
      });
    }
    else {
      console.log(s);
      fetch(`${process.env.REACT_APP_NAVER_REDIRECT_URL}/saveBookmark/inform?email=${email}&bookMarklist=${s}`)
        .then((res) => res.text())
        .then((data) => console.log(data));
        toast.warning("저장 완료!", {
          style: {
            fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
            fontSize: '16px', // 글씨 크기 설정
            fontWeight: 'bold', // 글씨 굵기 설정
            whiteSpace: 'pre-line', // 줄 바꿈 적용
          }
        });
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
      toast.warning("로그인하시면 서버에 저장된 즐겨찾기 목록을 불러올 수 있어요!", {
        style: {
          fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
          fontSize: '16px', // 글씨 크기 설정
          fontWeight: 'bold', // 글씨 굵기 설정
          whiteSpace: 'pre-line', // 줄 바꿈 적용
        }
      });
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
            toast.warning("저장된 북마크 기록이 없습니다!", {
              style: {
                fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
                fontSize: '16px', // 글씨 크기 설정
                fontWeight: 'bold', // 글씨 굵기 설정
                whiteSpace: 'pre-line', // 줄 바꿈 적용
              }
            });
          }
        });
    }
  }

  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>X</button>
        <div className="theme-select">
          <label style={{ fontFamily: 'DungGeunMo' }} htmlFor="theme-select">테마 선택 </label>
          <select id="theme-select" value={selectedTheme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
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