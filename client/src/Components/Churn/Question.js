import API from "../../utils/API";
import {useState, useEffect} from "react";

function Question(props) {
    const Question = props.Question
    const FirstQuestionIMG = props.FirstQuestionIMG

    const [isSaved, setisSaved] = useState(false)

    useEffect(() => {
        CheckSaved(Question.questionid, props.LoginData.Email)
    }, [])
    async function CheckSaved(QuestionID, Email) {
        try {
            const result = await API.get('/Questions/CheckSaved/' + QuestionID + '/' + Email)
            console.log(result.data)
            setisSaved(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function SaveQuestion(event, QuestionID, Email) {
        event.stopPropagation();
        
        try {
            console.log(Email)
            await API.post('/Questions/Save/' + QuestionID + '/' + Email)
            setisSaved(true)
        } catch(err) {
            console.log(err)
        }
    }

    async function UnsaveQuestion(event, QuestionID, Email) {
        event.stopPropagation();
        
        try {
            console.log(Email)
            await API.post('/Questions/Unsave/' + QuestionID + '/' + Email)
            setisSaved(false)
        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div>
            <img src={'data:image/png;base64,' + FirstQuestionIMG.QuestionIMGData} alt={FirstQuestionIMG.QuestionIMGName} style={{width:100, float:'left'}} />
            School: {Question.schoolname ? Question.schoolname : <span>NA</span>} <br />
            Uploader: {Question.firstname + ' ' + Question.lastname} <br />
            Topic: {Question.topicname} <br />
            Level: {Question.level} <br />
            Paper: {Question.paper} <br />
            Assessment: {Question.assessmentname} <br />
            School: {Question.schoolname} <br />

            {/* only show option to save question if logged in */}
            {props.LoginData.Email ?
                isSaved ?
                    <button onClick={event => UnsaveQuestion(event, Question.questionid, props.LoginData.Email)}>UnSave</button>
                :
                    <button onClick={event => SaveQuestion(event, Question.questionid, props.LoginData.Email)}>Save</button>
                
            :
                null
            }
        </div>
    )
}

export default Question;