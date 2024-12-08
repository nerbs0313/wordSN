import './App.css';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackToHome from './BackToHome';  // BackToHome 컴포넌트 가져오기
import SearchInputBox from './SearchInputBox';  // SearchInputBox 임포트
import OpenBookMark from './OpenBookMark'; // 경로를 파일 위치에 맞게 수정하세요
import PrettyToast from './PrettyToast';
import LoginInfo from './LoginInfo';
import ModalComp from './ModalComp';
import WordSpace from './WordSpace';
import 'react-toastify/dist/ReactToastify.css';
const THEME_KEY = "@theme";

// CSS Styles
const styles = `
  .quizContainer {  
    padding: 10px;
    border-bottom: 2px solid #ccc;
  }

  .quiz {
    margin-top: 10px;
    max-height : 300px;
  }

  .quizQuestion.light {
    color: var(--word-color);
  }

  .quizQuestion.dark {
    color: var(--word-color);
  }

  .quizOptions {
    list-style-type: none;
    padding: 0;
  }

  .quizOption {
    padding: 8px 12px;
    margin: 5px 0;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: background-color 0.3s ease;
    color: var(--word-color); 
  }

  .quizOption:hover {
    background-color: #f0f0f0;
  }
  /* Wrong Answers Styles */
  .wrongAnswers {
    margin-top: 10px;
    max-height: 272.6px; /* 원하는 최대 높이 설정 */
    overflow-y: auto; /* 오답 노트에서 수직 스크롤 허용 */
  }

  .wrongAnswersTitle.light {
    color: var(--word-color); /* 라이트 모드 텍스트 색상 */
  }

  .wrongAnswersTitle.dark {
    color: var(--word-color); /* 다크 모드 텍스트 색상 */
  }

  .wrongAnswersDate.light {
    margin-bottom: 10px; /* 아래쪽에만 여백 추가 */
    margin-top: 10px; /* 아래쪽에만 여백 추가 */
    font-size: 24px;   /* 폰트 크기 */
    text-align: center; /* 중앙 정렬 */
    font-family: Arial, sans-serif;   /* 폰트 Arial 설정 */
    color: var(--word-color); /* 라이트 모드에서 날짜 색상 */
  }

  .wrongAnswersDate.dark {
    margin-bottom: 10px; /* 아래쪽에만 여백 추가 */
    margin-top: 10px; /* 아래쪽에만 여백 추가 */
    font-size: 24px;   /* 폰트 크기 */
    text-align: center; /* 중앙 정렬 */
    font-family: Arial, sans-serif;   /* 폰트 Arial 설정 */
    color: var(--word-color); /* 다크 모드에서 날짜 색상 */
  }

  .wrongAnswersWord.light {
    display: flex;
    justify-content: center; /* 중앙 정렬 */
    padding: 4px 0;
    color: var(--word-color); /* 라이트 모드에서 단어 색상 */
  }

  .wrongAnswersWord.dark {
    display: flex;
    justify-content: center; /* 중앙 정렬 */
    padding: 4px 0;
    color: var(--word-color); /* 다크 모드에서 단어 색상 */
  }
`;

// Add styles to the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function App() {
  console.log("start App");
  const [bookmarkCur, bookmarkAfter] = useState("★");
  const [theme, setTheme] = useState('light'); // 기본 값은 light로 설정
  const [selectedTheme, setSelectedTheme] = useState('light');

  // 애플리케이션 초기화 시, AsyncStorage에서 테마 값을 불러와 설정
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
          setSelectedTheme(savedTheme); // 초기 선택 테마 설정
        }
      } catch (error) {
        console.error('Error fetching theme from AsyncStorage:', error);
      }
    };

    fetchTheme();
  }, []);

  // 테마 변경 함수: 테마 변경 후 AsyncStorage에 저장
  const changeTheme = async (selectedTheme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, selectedTheme);
      setTheme(selectedTheme);
      setSelectedTheme(selectedTheme); // 테마 변경 시 선택된 테마 업데이트
    } catch (error) {
      console.error('Error saving theme to AsyncStorage:', error);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  var email = urlParams.get('email');
  var login = urlParams.get('login');
  // 테마에 따라 CSS 변수 설정 함수
  const applyTheme = () => {
    let BackgroundColor, HeadColor, wordbackColor, wordColor;

    switch (theme) {
      case 'light':
        BackgroundColor = '#F7E3EE';
        HeadColor = '#F298C0';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      case 'dark':
        BackgroundColor = 'black';
        HeadColor = '#1C1C1C';
        wordbackColor = `#383838`;
        wordColor = 'white';
        break;
      case 'peach':
        BackgroundColor = '#FEEDE3';
        HeadColor = '#FF9797';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      case 'sky':
        BackgroundColor = '#E1FAB6';
        HeadColor = '#D1F3FF';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      case 'autumn':
        BackgroundColor = '#FEF8B0';
        HeadColor = '#F6B36E';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      case 'candy':
        BackgroundColor = '#D3EBF1';
        HeadColor = '#F6C4D3';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      case 'green':
        BackgroundColor = '#F6C4D3';
        HeadColor = '#B8DBD3';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      case 'bug':
        BackgroundColor = '#FEF8B0';
        HeadColor = '#F6B36E';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
      default:
        BackgroundColor = '#EFC6E2';
        HeadColor = '#DEC4F5';
        wordbackColor = `#d2d2d2`;
        wordColor = 'black';
        break;
    }

    document.documentElement.style.setProperty('--background-color', BackgroundColor);
    document.documentElement.style.setProperty('--head-background-color', HeadColor);
    document.documentElement.style.setProperty('--word-background-color', wordbackColor);
    document.documentElement.style.setProperty('--word-color', wordColor);
  };
  // 초기 마운트 시 한 번 테마 적용
  applyTheme();
  return (
    bookmarkCur === '★'
      ? <div>
        <div className="black-nav">
          <div style={{ textAlign: 'center' }}>
            <a className="name">마이</a> <br />
            <a className="name">의학용어</a>
          </div>
          <div className="Head_option">
            <SearchInputBox />
            <OpenBookMark openBookMark={() => {
              bookmarkAfter('☆'); // 여기서 북마크 처리 함수를 호출
            }} />
          </div>
        </div>
        <WordSpace bookMarkPage={false} login={login} />
      </div>
      : <div>
        <div className="black-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
            <BackToHome backToHome={() => {
              bookmarkAfter('★');  // BackToHome 클릭 시 bookmarkAfter 실행
            }} />
            <h4 class="name2">즐겨찾기</h4>
          </div>
          <div className="Head_option3">
            <div style={{ fontFamily: 'DungGeunMo' }} >
              <LoginInfo email={email} login={login} />
            </div>
            <div className="Head_option2">
              <PrettyToast />
              <ModalComp changeTheme={changeTheme} selectedTheme={selectedTheme} />
            </div>
          </div>
        </div>
        <WordSpace bookMarkPage={true} login={login} />
      </div>
  );
}

export default App;
