import './App.css';
import Naver from './naver';
import { useState, useEffect } from 'react';
import wordData from './Data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from './Modal';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const STORAGE_KEY = "@toDos";
const WRONG_ANSWERS_KEY = "@wrongAnswers";
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <img className="headingItemOption2" src={`${process.env.PUBLIC_URL}/images/setting.png`} alt="load" onClick={openModal} />
      {isModalOpen && <div className="backdrop" onClick={closeModal} />}
      {isModalOpen && <Modal closeModal={closeModal} changeTheme={changeTheme} selectedTheme={selectedTheme} />}
    </div>
  );
}

function SaveBookMark(props) {
  return (
    <img className="headingItemOption2" src={`${process.env.PUBLIC_URL}/images/save.png`} alt="save" onClick={async (event) => {
      event.preventDefault();
      const url = new URL(window.location.href);
      const urlParams = url.searchParams;
      var email = urlParams.get('email');
      var login = urlParams.get('login');
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (!email || !login) {
        toast.warning('로그인 필요!');
      } else {
        fetch(`${process.env.REACT_APP_NAVER_REDIRECT_URL}/saveBookmark/inform?email=${email}&bookMarklist=${s}`)
          .then((res) => res.text())
          .then((data) => console.log(data));
        props.saveBookMark();
        toast.warning('저장 완료');
      }
    }} />
  );
}

function BackToHome(props) {
  return <h4 className="backButton" onClick={(event) => {
    event.preventDefault();
    props.backToHome();
  }}> ＜ </h4>
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
    <textarea placeholder="검색할 단어를 입력하세요" className="headingItemOptionSearch" onChange={(e) => {
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
        <div>　</div>
        <div>　</div>
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
  const loadWrongAnswers = async () => {
    try {
      const w = await AsyncStorage.getItem(WRONG_ANSWERS_KEY);
      const savedWrongAnswers = JSON.parse(w) || {};
      setWrongAnswers(savedWrongAnswers);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    console.log("use effect in WordSpace component");
    loadToDos();
  }, []);

  const generateQuiz = () => {
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
      <div id={wordindex} className="wordBGImg">
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
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const word = quizQuestion;

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
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success('정답입니다!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      return newState;
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


  return (
    <div className="wordListCss">
      {props.bookMarkPage && (
        <div className="quizContainer">
          <button onClick={generateQuiz}>퀴즈 생성</button>
          <button onClick={() => {
            if (props.login === 'true') {
              setIsWrongAnswersVisible(!isWrongAnswersVisible);
            } else {
              toast.warning('로그인 필요!');
            }
          }}>오답 노트</button>

          {quizQuestion && (
            <div className="quiz">
              <h4 className={props.bgcolor ? "quizQuestion dark" : "quizQuestion light"}>{quizQuestion}</h4>
              <ul className="quizOptions">
                {quizOptions.map((option, index) => (
                  <li key={index} className="quizOption" onClick={() => handleQuizAnswer(option)}>
                    {index + 1}. {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isWrongAnswersVisible && (
            <div className="wrongAnswers">
              <h4>오답 노트</h4>
              {Object.keys(wrongAnswers).map(date => (
                <div key={date}>
                  <h5>{date}</h5>
                  {Object.keys(wrongAnswers[date]).map(word => (
                    <p key={word}>{word}: {wrongAnswers[date][word].wrong}회 / {wrongAnswers[date][word].total}회</p>
                  ))}
                </div>
              ))}
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
        const savedTheme = await AsyncStorage.getItem('@theme');
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
      await AsyncStorage.setItem('@theme', selectedTheme);
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
        wordbackColor = `url('https://i.imgur.com/ZRT20vs.png')`;
        wordColor = 'black';
        break;
      case 'dark':
        BackgroundColor = 'black';
        HeadColor = '#1C1C1C';
        wordbackColor = `url('https://i.imgur.com/KjAaaFN.png')`;
        wordColor = 'white';
        break;
      case 'peach':
        BackgroundColor = '#FEEDE3';
        HeadColor = '#FF9797';
        wordbackColor = 'white';
        wordColor = 'black';
        break;
      case 'sky':
        BackgroundColor = '#E1FAB6';
        HeadColor = '#D1F3FF';
        wordbackColor = 'white';
        wordColor = 'black';
        break;
      case 'autumn':
        BackgroundColor = '#FEF8B0';
        HeadColor = '#F6B36E';
        wordbackColor = 'white';
        wordColor = 'black';
        break;
      case 'candy':
        BackgroundColor = '#D3EBF1';
        HeadColor = '#F6C4D3';
        wordbackColor = 'white';
        wordColor = 'black';
        break;
      case 'green':
        BackgroundColor = '#F6C4D3';
        HeadColor = '#B8DBD3';
        wordbackColor = 'white';
        wordColor = 'black';
        break;
      case 'bug':
        BackgroundColor = '#FEF8B0';
        HeadColor = '#F6B36E';
        wordbackColor = 'white';
        wordColor = 'black';
        break;
      default:
        BackgroundColor = '#EFC6E2';
        HeadColor = '#DEC4F5';
        wordbackColor = 'white';
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
          <div>
            <img className="name" src={`${process.env.PUBLIC_URL}/images/namm.png`} alt="My Image" />
          </div>
          <div className="Head_option">
            <SearchInputBox searchInput={() => { }} />
            <RevertColor revertColor={() => {
              changeTheme(theme === 'light' ? 'dark' : 'light'); // 토글하는 예제로 수정
            }} />
            <OpenBookMark openBookMark={() => {
              bookmarkAfter('☆');
            }} />
          </div>
        </div>
        <WordSpace bookMarkPage={false} />
      </div>
      : <div>
        <div className="black-nav">
          <div className="Head_option2">
            <BackToHome backToHome={() => {
              bookmarkAfter('★');
            }} />
            <h4>북마크</h4>
          </div>
          <div className="Head_option3">
            <div>
              <LoginInfo email={email} login={login} />
            </div>
            <div className="Head_option2">
              <ModalComp changeTheme={changeTheme} selectedTheme={selectedTheme} />
            </div>
          </div>
        </div>
        <WordSpace bookMarkPage={true} />
      </div>
  );
}

export default App;
