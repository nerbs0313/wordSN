
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

export default WordComponent;