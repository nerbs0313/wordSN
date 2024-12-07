import React, { useState } from 'react';

// getElementY 함수는 요소의 Y 좌표를 반환하는 유틸리티 함수로 가정합니다.
const getElementY = (element) => {
    const offset = window.pageYOffset + element.getBoundingClientRect().top;

    // 'calc(100vh * 0.12)' 값을 계산
    const offsetAdjustment = window.innerHeight * 0.12;

    return offset - offsetAdjustment;
}

function SearchInputBox(props) {
    const [text, setText] = useState('');
    let Num = -1;

    if (document.getElementsByClassName('wordColor') !== null) {
        let elements = document.getElementsByClassName('wordColor');
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].innerHTML.toUpperCase().includes(text.toUpperCase())) {
                Num = i;
                break;
            }
        }
    }

    if (Num !== -1) {
        if (document.getElementById(Num) !== null) {
            window.scrollTo(0, getElementY(document.getElementById(Num)));
        }
    }

    return (
        <textarea
            placeholder="단어를 입력하세요!"
            className="headingItemOptionSearch"
            onChange={(e) => {
                setText(e.target.value);
            }}
            value={text} // 텍스트를 상태에 연결
        />
    );
}

export default SearchInputBox;
