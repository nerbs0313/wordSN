import wordData from './Data';
import QuizComponent from './QuizComponent';
import WordFunction from './WordFunction';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = "@toDos";

function WordSpace(props) {
  let [wordList, setWordList] = useState([]);
  const [DisplayArr, setDisplayArr] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  console.log("컴포넌트가 불림");
 
  useEffect(() => {
    console.log("use effect in WordSpace component");
    loadToDos();
  }, []);

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

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  
  function SetBookMark_(wordindex) {
    setIsUpdated(prev => !prev);
    AsyncStorage.setItem(wordindex, "true");
    if (wordList != null) {
      wordList = [...wordList, wordindex];
    } else {
      wordList = [wordindex];
    }
    saveToDos(wordList);
    setWordList(wordList);
    setDisplayArr({ ...DisplayArr, [wordindex]: true });
  }

  function RemoveBookMark_(wordindex) {
    setIsUpdated(prev => !prev);
    let filtered = wordList.filter((element) => element !== wordindex);
    saveToDos(filtered);
    setWordList(filtered);
    setDisplayArr({ ...DisplayArr, [wordindex]: false });
  }

  return (
    <div className="wordListCss">
      {props.bookMarkPage && (
        <QuizComponent
          bgcolor={props.bgcolor}
          wordData={wordData}
          wordList={wordList}
          login={props.login}
        >
        </QuizComponent>
      )}
      {props.bookMarkPage === false ?
        wordList === null ?
          wordData.map((word, index) => (
            <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='☆'
              SetBookMark={() => { SetBookMark_(word.idx); }}></WordFunction>
          ))
          :
          wordData.map((word, index) => (
            DisplayArr[word.idx] === true ?
              <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='★'
                RemoveBookMark={() => { RemoveBookMark_(word.idx); }}></WordFunction>
              :
              <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='☆'
                SetBookMark={() => { SetBookMark_(word.idx); }}></WordFunction>
          ))
        :
        wordData.map((word, index) => (
          DisplayArr[word.idx] === true ?
            <WordFunction word={word.word} explain={word.explain} Abbreviation={word.Abbreviation} idx={word.idx} bookMark='★'
              RemoveBookMark={() => { RemoveBookMark_(word.idx); }}></WordFunction>
            :
            <a></a>
        ))
      }

    </div>
  );
}

export default WordSpace;