// ModalComp.js
import React, { useState } from 'react';
import Modal from './Modal'; // Modal 컴포넌트 import
import ModalLogin from './ModalLogin'; // ModalLogin 컴포넌트 import

function ModalComp({ changeTheme, selectedTheme }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNaverModalOpen, setIsNaverModalOpen] = useState(false); // 네이버 모달 상태 추가

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openNaverModal = () => {
        setIsNaverModalOpen(true); // 네이버 모달 열기
    };

    const closeNaverModal = () => {
        setIsNaverModalOpen(false); // 네이버 모달 닫기
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <img
                    className="naverIcon"
                    src={`${process.env.PUBLIC_URL}/images/naver.png`}
                    alt="Naver"
                    onClick={openNaverModal} // 클릭 시 네이버 모달 열기
                />
                <img
                    className="headingItemOption2"
                    src={`${process.env.PUBLIC_URL}/images/setting.png`}
                    alt="load"
                    onClick={openModal}
                />
                {isModalOpen && <div className="backdrop" onClick={closeModal} />}
                {isModalOpen && <Modal closeModal={closeModal} changeTheme={changeTheme} selectedTheme={selectedTheme} />}
            </div>

            {/* 네이버 모달 */}
            {isNaverModalOpen && <div className="backdrop" onClick={closeNaverModal} />}
            {isNaverModalOpen && <ModalLogin closeModal={closeNaverModal} />}
        </div>
    );
}

export default ModalComp;
