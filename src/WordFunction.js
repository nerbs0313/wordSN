import WordComponent from './WordComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
const STORAGE_KEY = "@toDos";

function WordFunction(props) {



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
      <WordComponent word={display} bookMark={props.bookMark} onChangeMode={() => {
        if (mode === "word") {
          setMode("explain");
        } else if (mode === "explain") {
          setMode("word");
        }
      }} onChangeBookMark={() => {
        if (props.bookMark === "☆") {
          props.SetBookMark();
        } else if (props.bookMark === "★") {
          props.RemoveBookMark();
        }
      }}></WordComponent>
    </div>
  )
}

export default WordFunction;