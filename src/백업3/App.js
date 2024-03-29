
import './App.css'
import { useState, useEffect } from 'react'
import wordData from './Data'
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@toDos";

function BackToHome(props) {
  return <h4 class="backButton" onClick={function (event) {
    event.preventDefault();
    props.backToHome();
  }}> ＜ </h4>

}

function OpenBookMark(props) {
  return <h4 onClick={function (event) {
    props.openBookMark();
  }}
  >★</h4>
}


function WordComponent(props) {
  return <div class="wordComponent">
    <div onClick={function (event) {
      event.preventDefault();
      props.onChangeMode();
    }}
      class="wordColor">{props.word}</div>
    <div class="bookmark">
      <div onClick={function (event) {
        props.onChangeBookMark();
      }}> {props.bookMark}</div>
      <div>　</div>
      <div>　</div>
    </div>
  </div>
}


function WordSpace(props) {
  const clearAll = async () => {
    console.log("초기화완료")
    await AsyncStorage.clear();
    setWordList(null);
  }
  //todolist obj
  let [wordList, setWordList] = useState([]);
  
  console.log("컴포넌트가 불림")
  const loadToDos = async () => {
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
  useEffect(() => {
    console.log("use effect in WordSpace component")
    loadToDos();




  }, [])
  console.log(wordList)

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
      console.log("saveToDost", toSave);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)) //Object to String
    }

    console.log("wordFunction");
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
      <div>

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
            let filtered 
            = wordList.filter((element) => element !== wordindex);
            saveToDos(wordList);
            setWordList(filtered);
            console.log(filtered);
            console.log("인덱스 제거완료 ", wordindex)
          }
        }}></WordComponent>
      </div>


    )

  }
  console.log("displayArr",DisplayArr);
  return <div>
    <button onClick={clearAll}>초기화</button>
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
      wordList === null ?
        <a></a>
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


function App() {









  console.log("start App");


  const _bookmark = useState("★");
  const bookmarkCur = _bookmark[0];
  const bookmarkAfter = _bookmark[1];









  return (
    bookmarkCur === '★'
      ? <div>
        <div className="black-nav">
          <h4 className="name">의학 용어 단어</h4>
          <OpenBookMark openBookMark={function () {
            bookmarkAfter('☆')
          }}></OpenBookMark>
        </div>
        <WordSpace bookMarkPage={false}></WordSpace>


      </div >
      : <div>
        <div className="black-nav2">


          <BackToHome backToHome={function () {
            bookmarkAfter('★')
          }} ></BackToHome>
          <h4 className="name2">북마크</h4>


        </div>
        {
          <WordSpace bookMarkPage={true}></WordSpace>
        }



      </div>


  )
}





export default App
