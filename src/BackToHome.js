function BackToHome(props) {
    return (
        <img
            className="backButton"
            src={`${process.env.PUBLIC_URL}/images/back.png`}
            alt="back"
            onClick={(event) => {
                event.preventDefault();
                props.backToHome();  // backToHome 함수 실행
            }}
        />
    );
}

export default BackToHome;
