import './App.css';
import Naver from './naver';
import { useState, useEffect } from 'react';
import wordData from './Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from './Modal';
import ModalLogin from './ModalLogin';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const STORAGE_KEY = "@toDos";
const WRONG_ANSWERS_KEY = "@wrongAnswers";
const THEME_KEY = "@theme";
const PREV_THEME_KEY = "@pretheme";
function PrettyToast(props) {
  const notify = () => toast.warning('로그인 필요!');

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

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
        <img className="headingItemOption2" src={`${process.env.PUBLIC_URL}/images/setting.png`} alt="load" onClick={openModal} />
        {isModalOpen && <div className="backdrop" onClick={closeModal} />}
        {isModalOpen && <Modal closeModal={closeModal} changeTheme={changeTheme} selectedTheme={selectedTheme} />}
      </div>

      {/* 네이버 모달 */}
      {isNaverModalOpen && <div className="backdrop" onClick={closeNaverModal} />}
      {isNaverModalOpen && <ModalLogin closeModal={closeNaverModal} />} {/* NaverModal은 별도로 정의 필요 */}
    </div>
  );
}


function BackToHome(props) {
  return <img className="backButton" src={`${process.env.PUBLIC_URL}/images/back.png`} alt="back" onClick={(event) => {
    event.preventDefault();
    props.backToHome();
  }} />
}

function OpenBookMark(props) {
  return <h4 className="headingItemOption" onClick={props.openBookMark}>★</h4>
}

function RevertColor(props) {
  return <h4 className="headingItemOption" onClick={props.revertColor}>◑</h4>
}

const getElementY = (element) => {
  return window.pageYOffset + element.getBoundingClientRect().top - 70;
}

function SearchInputBox(props) {
  const [text, setText] = useState('');
  let Num = -1;
  if (document.getElementsByClassName('wordColor') != null) {
    let elements = document.getElementsByClassName('wordColor');
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].innerHTML.toUpperCase().includes(text.toUpperCase())) {
        Num = i;
        break;
      }
    }
  }
  if (-1 != Num) {
    if (document.getElementById(Num) != null) {
      window.scrollTo(0, getElementY(document.getElementById(Num)))
    }
  }
  return (
    <textarea placeholder="단어를 입력하세요!" className="headingItemOptionSearch" onChange={(e) => {
      setText(e.target.value);
    }}></textarea>
  );
}

function WordComponent(props) {
  return (
    <div className="wordComponent">
      <div onClick={(event) => {
        event.preventDefault();
        props.onChangeMode();
      }} className="wordColor">{props.word}</div>
      <div className="bookmark">
        <div onClick={props.onChangeBookMark}>{props.bookMark}</div>
      </div>
    </div>
  );
}

function LoginInfo(props) {
  const login = props.login;
  const userid = props.email;
  return login === 'true' ? <div> {userid} </div> : <div> </div>;
}

function WordSpace(props) {
  let [wordList, setWordList] = useState([]);
  let [quizQuestion, setQuizQuestion] = useState(null);
  let [quizOptions, setQuizOptions] = useState([]);
  let [quizAnswer, setQuizAnswer] = useState(null);
  let [wrongAnswers, setWrongAnswers] = useState({});
  let [isWrongAnswersVisible, setIsWrongAnswersVisible] = useState(false);
  let [isQuizVisible, setIsQuizVisible] = useState(false);
  const [DisplayArr, setDisplayArr] = useState({});

  console.log("컴포넌트가 불림");
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      console.log("loadToDos ", s);
      const savedWordList = JSON.parse(s);
      setWordList(savedWordList);

      const displayArr = {};
      if (savedWordList) {
        savedWordList.forEach((idx) => {
          displayArr[idx] = true;
        });
      }
      setDisplayArr(displayArr);
    } catch (e) {
      console.log(e);
    }
  };

  const loadWrongAnswersFromDB = async (email) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_NAVER_REDIRECT_URL}/api/wrong-answers?email=${encodeURIComponent(email)}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Loaded wrong answers from DB:', data); // 로드된 오답 목록 로그
      return data;
    } catch (error) {
      console.error('Failed to load wrong answers:', error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  };

  useEffect(() => {
    console.log("use effect in WordSpace component");
    loadToDos();

    const loadData = async (email) => {

      console.log(email);
      const savedData = await loadWrongAnswersFromDB(email); // DB에서 모든 데이터 로드

      const newState = {}; // 상태 초기화
      savedData.forEach(entry => {
        const { date, word, wrong, total } = entry;

        if (!newState[date]) {
          newState[date] = {};
        }

        newState[date][word] = { wrong, total }; // 날짜와 단어를 키로 사용하여 상태 업데이트
      });

      setWrongAnswers(newState); // 상태 업데이트
    };

    // 데이터 로드 함수 호출

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (email) {
      loadData(email);
    }
  }, []);

  const generateQuiz = (ControlDisplay) => {
    if (ControlDisplay) {
      setIsQuizVisible(!isQuizVisible);
    }
    if (wordList != null) {
      const bookmarkedWords = wordData.filter(word => wordList.includes(word.idx));
      if (bookmarkedWords.length > 0) {
        const questionWord = bookmarkedWords[Math.floor(Math.random() * bookmarkedWords.length)];
        const options = [questionWord.explain];
        while (options.length < 4) {
          const option = wordData[Math.floor(Math.random() * wordData.length)].explain;
          if (!options.includes(option)) {
            options.push(option);
          }
        }
        setQuizQuestion(questionWord.word);
        setQuizOptions(shuffleArray(options));
        setQuizAnswer(questionWord.explain);
        setIsWrongAnswersVisible(false);
      }
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  function WordFunction(props) {
    const saveToDos = async (toSave) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };

    const _bookmark = useState(props.bookMark);
    let bookmark = _bookmark[0];
    const setbookmark = _bookmark[1];

    const _mode = useState("word");
    const mode = _mode[0];
    const setMode = _mode[1];

    let word = props.word;
    let explain = props.explain;
    let wordindex = props.idx;
    let display = word;
    if (mode === "word") {
      display = word;
    }
    else if (mode === "explain") {
      display = explain;
    }

    return (
      <div id={wordindex} >
        <WordComponent word={display} bookMark={bookmark} onChangeMode={() => {
          if (mode === "word") {
            setMode("explain");
          } else if (mode === "explain") {
            setMode("word");
          }
        }} onChangeBookMark={() => {
          if (bookmark === "☆") {
            setbookmark("★");
            AsyncStorage.setItem(wordindex, "true");
            if (wordList != null) {
              wordList = [...wordList, wordindex];
            } else {
              wordList = [wordindex];
            }
            saveToDos(wordList);
            setWordList(wordList);
            setDisplayArr({ ...DisplayArr, [wordindex]: true });
          } else if (bookmark === "★") {
            setbookmark("☆");
            let filtered = wordList.filter((element) => element !== wordindex);
            saveToDos(filtered);
            setWordList(filtered);
            setDisplayArr({ ...DisplayArr, [wordindex]: false });
          }
        }}></WordComponent>
      </div>
    )
  }

  const handleQuizAnswer = (option) => {
    const currentDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    console.log(currentDate);
    const word = quizQuestion;

    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    setWrongAnswers(prevState => {
      const newState = { ...prevState };

      if (!newState[currentDate]) {
        newState[currentDate] = {};
      }

      if (!newState[currentDate][word]) {
        newState[currentDate][word] = { wrong: 0, total: 0 };
      }

      newState[currentDate][word].total += 1;

      if (option !== quizAnswer) {
        newState[currentDate][word].wrong += 1;
        toast.warning('오답입니다!', {
          style: {
            fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
            fontSize: '16px', // 글씨 크기 설정
            fontWeight: 'bold', // 글씨 굵기 설정
            whiteSpace: 'pre-line', // 줄 바꿈 적용
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        });
      } else {
        toast.success('정답입니다!', {
          style: {
            fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
            fontSize: '16px', // 글씨 크기 설정
            fontWeight: 'bold', // 글씨 굵기 설정
            whiteSpace: 'pre-line', // 줄 바꿈 적용
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        });
      }

      // DB에 저장
      if (email) {
        saveWrongAnswerToDB(currentDate, word, newState[currentDate][word].wrong, newState[currentDate][word].total, email);
      }
      return newState; // 로드 ( 오답 노트 상태 업데이트 )

    });
  };
  const saveWrongAnswers = async (wrongAnswers) => {
    try {
      await AsyncStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(wrongAnswers));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    saveWrongAnswers(wrongAnswers);
  }, [wrongAnswers]);



  const saveWrongAnswerToDB = async (date, word, wrong, total, email) => {
    try {
      await fetch(`${process.env.REACT_APP_NAVER_REDIRECT_URL}/api/wrong-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, word, wrong, total, email }), // 이메일 포함
      });
    } catch (error) {
      console.error('Failed to save wrong answer:', error);
    }
  };


  return (
    <div className="wordListCss">
      {props.bookMarkPage && (
        <div className="quizContainer">
          <div className="button-container">
            <button className="quiz-button" onClick={() => {
              if (props.login === 'true') {
                generateQuiz(true);
              } else {
                toast.warning("로그인하시면 쪽지시험,오답노트를 이용하실 수 있어요! ", {
                  style: {
                    fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
                    fontSize: '16px', // 글씨 크기 설정
                    fontWeight: 'bold', // 글씨 굵기 설정
                    whiteSpace: 'pre-line', // 줄 바꿈 적용
                  },
                  icon: <span style={{ fontSize: "40px", marginBottom: "8px", color: "gold" }}>★</span>
                });
              }
            }}>쪽지시험!</button>

            <button className="wrong-answers-button" onClick={() => {
              if (props.login === 'true') {
                setIsWrongAnswersVisible(!isWrongAnswersVisible);
                setIsQuizVisible(false);
              } else {
                toast.warning("로그인하시면 쪽지시험,오답노트를 이용하실 수 있어요! ", {
                  style: {
                    fontFamily: 'DungGeunMo, sans-serif', // 글씨체 설정
                    fontSize: '16px', // 글씨 크기 설정
                    fontWeight: 'bold', // 글씨 굵기 설정
                    whiteSpace: 'pre-line', // 줄 바꿈 적용
                  },
                  icon: <span style={{ fontSize: "40px", marginBottom: "8px", color: "gold" }}>★</span>
                });
              }
            }}>오답노트!</button>
          </div>

          {isQuizVisible && !isWrongAnswersVisible && quizQuestion && (
            <div className="quiz">
              <h4 className={props.bgcolor ? "quizQuestion dark" : "quizQuestion light"}>{quizQuestion}</h4>
              <ul className="quizOptions">
                {quizOptions.map((option, index) => (
                  <li key={index} className="quizOption" onClick={() => handleQuizAnswer(option)}>
                    {index + 1}. {option}
                  </li>
                ))}
              </ul>
              <button className="quiz-button2" onClick={() => generateQuiz(false)}>다음</button>
            </div>
          )}

          {!isQuizVisible && isWrongAnswersVisible && (
            <div className="wrongAnswers">
              {Object.keys(wrongAnswers)
                .sort((a, b) => {
                  return new Date(b) - new Date(a);
                }) // Date 기준 내림차순 정렬
                .map(date => (
                  <div key={date}>
                    <h5 style={{ fontFamily: 'DungGeunMo' }} className={props.bgcolor ? "wrongAnswersDate dark" : "wrongAnswersDate light"}>{date}</h5>
                    {Object.keys(wrongAnswers[date])
                      .sort((a, b) => {
                        return wrongAnswers[date][b].wrong - wrongAnswers[date][a].wrong;
                      }) // wrong 값 기준 내림차순 정렬
                      .map(word => (
                        <div key={word} className={props.bgcolor ? "wrongAnswersWord dark" : "wrongAnswersWord light"}>
                          <span className="word">{word}</span>
                          <span className="wrongCount">
                            {wrongAnswers[date][word].wrong}회
                                </span>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}
      {props.bookMarkPage === false ?
        wordList === null ?
          wordData.map((word, index) => (
            <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='☆'></WordFunction>
          ))
          :
          wordData.map((word, index) => (
            DisplayArr[word.idx] === true ?
              <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='★'></WordFunction>
              :
              <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='☆'></WordFunction>
          ))
        :
        wordData.map((word, index) => (
          DisplayArr[word.idx] === true ?
            <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='★'></WordFunction>
            :
            <a></a>
        ))
      }

    </div>
  );
}

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

const urlCheck = (location) => {
  let getParameter = (key) => {
    return new URLSearchParams(location.search).get(key);
  };
  const name = getParameter("name");
  console.log('getParameter 함수: ', name);
}

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

  const revertTheme = async () => {
    try {
      var prevTheme = '';
      var curTheme = '';
      var ToTheme = '';
      prevTheme = await AsyncStorage.getItem(PREV_THEME_KEY);
      curTheme = await AsyncStorage.getItem(THEME_KEY);

      await AsyncStorage.setItem(PREV_THEME_KEY, curTheme);

      if (curTheme === 'dark') {
        if (prevTheme === null) {
          ToTheme = 'light';
        }
        else {
          ToTheme = prevTheme;
        }
      }
      else {
        ToTheme = 'dark';
      }

      changeTheme(ToTheme);
    }
    catch (error) { }
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
            <SearchInputBox searchInput={() => { }} />

            <OpenBookMark openBookMark={() => {
              bookmarkAfter('☆');
            }} />
          </div>
        </div>
        <WordSpace bookMarkPage={false} login={login} />
      </div>
      : <div>
        <div className="black-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
            <BackToHome backToHome={() => {
              bookmarkAfter('★');
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
