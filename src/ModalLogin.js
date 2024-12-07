import React from 'react';
import './ModalLogin.css';
import 'react-toastify/dist/ReactToastify.css';
import Naver from './naver';
const ModalLogin = ({ closeModal }) => {
  const urlParams = new URLSearchParams(window.location.search);
  var email = urlParams.get('email')
  var login = urlParams.get('login')

  return (
    <div className="modal-wrapper">
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>X</button>
        <div className="button-container">
        <Naver email={email} login={login} />
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;