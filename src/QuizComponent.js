import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const WRONG_ANSWERS_KEY = "@wrongAnswers";

function QuizComponent(props) {
  let [quizQuestion, setQuizQuestion] = useState(null);
  let [quizOptions, setQuizOptions] = useState([]);
  let [quizAnswer, setQuizAnswer] = useState(null);
  let [wrongAnswers, setWrongAnswers] = useState({});
  let [isWrongAnswersVisible, setIsWrongAnswersVisible] = useState(false);
  let [isQuizVisible, setIsQuizVisible] = useState(false);

  useEffect(() => {
    saveWrongAnswers(wrongAnswers);
  }, [wrongAnswers]);

  useEffect(() => {
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

  const saveWrongAnswers = async (wrongAnswers) => {
    try {
      await AsyncStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(wrongAnswers));
    } catch (e) {
      console.log(e);
    }
  };

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

  const generateQuiz = (ControlDisplay) => {
    if (ControlDisplay) {
      setIsQuizVisible(!isQuizVisible);
    }
    if (props.wordList != null) {
      const bookmarkedWords = props.wordData.filter(word => props.wordList.includes(word.idx));
      if (bookmarkedWords.length > 0) {
        const questionWord = bookmarkedWords[Math.floor(Math.random() * bookmarkedWords.length)];
        const options = [questionWord.explain];
        while (options.length < 4) {
          const option = props.wordData[Math.floor(Math.random() * props.wordData.length)].explain;
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


  return (
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
  );
}

export default QuizComponent;