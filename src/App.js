
import './App.css'
import Naver from './naver';
import { useState, useEffect } from 'react'
import wordData from './Data'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from './Modal';

import theme from "./theme";

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const STORAGE_KEY = "@toDos";


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

function LoadBookMark(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return <div>
    <img className="headingItemOption2" src={`${process.env.PUBLIC_URL}/images/setting.png`} alt="load" onClick={
      openModal

    }>
    </img>
    {isModalOpen && <div className="backdrop" onClick={closeModal} />}
    {isModalOpen && <Modal closeModal={closeModal} />}

  </div>
}

function SaveBookMark(props) {
  return <img className="headingItemOption2" src={`${process.env.PUBLIC_URL}/images/save.png`} alt="save" onClick={async (event) => {
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
      props.saveBookMark();
      toast.warning('저장 완료');
    }

  }}></img>
}

function BackToHome(props) {
  return <h4 class="backButton" onClick={function (event) {
    event.preventDefault();
    props.backToHome();
  }}> ＜ </h4>
}

function OpenBookMark(props) {
  return <h4 className="headingItemOption" onClick={function (event) {
    props.openBookMark();
  }}>★</h4>
}

function RevertColor(props) {
  return <h4 className="headingItemOption" onClick={function (event) {
    props.revertColor();
  }}>◑</h4>
}

const getElementY = (element) => {
  return window.pageYOffset + element.getBoundingClientRect().top - 70
}

function SearchInputBox(props) {
  const [text, setText] = useState('');
  //console.log("검색" + text);

  let Num = -1;
  if (document.getElementsByClassName('wordColor') != null) {
    let elements = document.getElementsByClassName('wordColor');

    for (var i = 0; i < elements.length; i++) {

      //console.log('출력되나' + elements[i].innerHTML ); // "1-2", "2-2"
      if (elements[i].innerHTML.toUpperCase().includes(text.toUpperCase())) {
        Num = i;
        break;
      }

    }
    //console.log(Num);
  }
  if (-1 != Num) {
    if (document.getElementById(Num) != null) {
      window.scrollTo(0, getElementY(document.getElementById(Num)))
    }
    //document.getElementById(text).scrollIntoView({ behavior: 'smooth',block: "center"});
  }
  return <textarea placeholder="검색할 단어를 입력하세요" className="headingItemOptionSearch" onChange={(e) => {
    setText(e.target.value);
  }}></textarea>
}

function WordComponent(props) {
  return <div class="wordComponent">

    <div onClick={function (event) {
      event.preventDefault();
      props.onChangeMode();
    }} class="wordColor">{props.word}</div>


    <div class="bookmark">
      <div onClick={function (event) {
        props.onChangeBookMark();
      }}>{props.bookMark}</div>
      <div>　</div>
      <div>　</div>

    </div>

  </div>

}

function LoginInfo(props) {

  const login = props.login;
  const userid = props.email;

  return login === 'true' ?
    <div> {userid} </div>
    :
    <div> </div>
}

function WordSpace(props) {
  // 3
  let [wordList, setWordList] = useState([]);

  console.log("컴포넌트가 불림")
  const loadToDos = async () => { // 2
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY)
      console.log("loadToDos ", s)
      //String to Object
      console.log("loadToDos ", JSON.parse(s))
      setWordList(JSON.parse(s))
    } catch (e) {
      console.log(e)
    }
  }

  let DisplayArr = [];
  //todolist obj
  useEffect(() => { // 1 ( 컴포넌트 호출 시, useEffect부터 수행 )
    console.log("use effect in WordSpace component")
    loadToDos();
  }, [])
  console.log('워드리스트' + wordList)

  wordData.map((word, index) => {
    let isExist = false;
    if (wordList != null) {
      wordList.map((wordListValue, index) => {
        if (word.idx == wordListValue) {
          isExist = true;
        }
      })

      if (isExist == true) {
        if (DisplayArr != null) {
          DisplayArr = [...DisplayArr, true];
        }
        else {
          DisplayArr = [true];
        }
      }
      else {
        if (DisplayArr != null) {
          DisplayArr = [...DisplayArr, false];
        }
        else {
          DisplayArr = [false];
        }
      }
    }
  })

  function WordFunction(props) {
    {/* 스타트를 ☆로 한다는 말인 것이지, 그 다음부터는 현재, 이후 의 의미만 의미 있음 */ }
    //async스토리지
    const saveToDos = async (toSave) => {
      console.log("saveToDos", toSave);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)) //Object to String
    }

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
        {/* WordComponent 라는 함수인데 인자로 word 랑 function을 넘김 */}
        <WordComponent word={display} bookMark={bookmark} onChangeMode={function () {
          if (mode === "word") {
            setMode("explain")
          }
          else if (mode === "explain") {
            setMode("word")
          }
        }} onChangeBookMark={function () {
          if (bookmark === "☆") {
            setbookmark("★")
            AsyncStorage.setItem(wordindex, "true");
            console.log("인덱스 추가완료 ", wordindex)

            if (wordList != null) {
              wordList = [...wordList, wordindex];
            }
            else {
              wordList = [wordindex];
            }
            console.log("인덱스 추가완료 ", wordindex)

            console.log(wordList);
            saveToDos(wordList);
            setWordList(wordList);
          }
          else if (bookmark === "★") {
            setbookmark("☆")
            let filtered = wordList.filter((element) => element !== wordindex);
            saveToDos(wordList);
            setWordList(filtered);
            console.log(filtered);
            console.log("인덱스 제거완료 ", wordindex)
          }
        }}></WordComponent>
      </div>
    )
  }
  return <div className="wordListCss">
    {/*<button onClick={clearAll}>초기화</button>*/}
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
}
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
  const [bgcolor, Setbgcolor] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  var email = urlParams.get('email')
  var login = urlParams.get('login')

  console.log(email);
  console.log(login);

  let BackgroundColor = '#F7E3EE';
  let HeadColor = '#F298C0';
  let wordbackColor = '#D2C8E3'
  let wordColor = 'black'
  if (bgcolor == true) {
    BackgroundColor = '#F7E3EE'
    HeadColor = '#F298C0'
    wordbackColor = `url('https://i.imgur.com/ZRT20vs.png')`
    wordColor = 'black'
  }
  else {
    BackgroundColor = 'black'
    HeadColor = '#1C1C1C'
    wordbackColor = `url('https://i.imgur.com/KjAaaFN.png')`
    wordColor = 'white'

  }

  document.documentElement.style.setProperty(
    '--background-color',
    BackgroundColor
  )

  document.documentElement.style.setProperty(
    '--head-background-color',
    HeadColor
  )

  document.documentElement.style.setProperty(
    '--word-background-color',
    wordbackColor
  )

  document.documentElement.style.setProperty(
    '--word-color',
    wordColor
  )

  document.documentElement.style.setProperty(
    '--white-word-BG',
    `url('https://i.imgur.com/ZRT20vs.png')`
  )


  {/*
  const changeText = (e) => {
    setColorCode(e.target.value);
  }

  const applyColor = () => {
    document.documentElement.style.setProperty(
      '--background-color',
      colorCode
    );
  }
  */}

  return (
    bookmarkCur === '★'
      ? <div>
        <div className="black-nav">
          <div>

            <img className="name" src={`${process.env.PUBLIC_URL}/images/namm.png`} alt="My Image">
            </img>
            {/*</img><h4 className="name">의학용어</h4>*/}
          </div>
          <div className="Head_option">
            {/*
          <input value={colorCode} onChange={changeText}/>
         <button onClick={applyColor}>적용</button>
            */}
            <SearchInputBox searchInput={function () {
              console.log("검색박스")
            }}></SearchInputBox>
            <RevertColor revertColor={function () {
              Setbgcolor(!bgcolor)
              console.log("헤드옵션불림")

            }}></RevertColor>
            <OpenBookMark openBookMark={function () {
              bookmarkAfter('☆')
            }}></OpenBookMark>
          </div>
        </div>
        <WordSpace bookMarkPage={false}></WordSpace>
      </div >
      : <div>
        <div className="black-nav">
          <div className="Head_option2">
            <BackToHome backToHome={function () {
              bookmarkAfter('★')
            }}></BackToHome>
            <h4>북마크</h4>
          </div>
          <div className="Head_option3" >
            <div>

              <LoginInfo email={email} login={login}></LoginInfo>

            </div>
            <div className="Head_option2">
              <PrettyToast></PrettyToast>
              <LoadBookMark loadBookMark={function () {
                window.location.replace("");
              }}></LoadBookMark>
            </div>
          </div>
        </div>


        {
          <WordSpace bookMarkPage={true}></WordSpace>
        }
      </div>
  )
}

export default App