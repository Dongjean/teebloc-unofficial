function Question(props) {
    const Question = props.Question
    const FirstQuestionIMG = props.FirstQuestionIMG
    return (
        <div>
            <img src={'data:image/png;base64,' + FirstQuestionIMG.QuestionIMGData} alt={FirstQuestionIMG.QuestionIMGName} style={{width:100, float:'left'}} />
            School: {Question.schoolname ? Question.schoolname : <span>NA</span>} <br />
            Uploader: {Question.firstname + ' ' + Question.lastname} <br />
            Topic: {Question.topicname} <br />
            Level: {Question.level} <br />
            Paper: {Question.paper} <br />
            Assessment: {Question.assessmentname}
        </div>
    )
}

export default Question;